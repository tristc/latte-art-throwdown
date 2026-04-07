const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all matches for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status, round } = req.query;

    let query = `
      SELECT m.*, 
        ca.user_id as competitor_a_user_id, ca.competitor_number as competitor_a_number,
        ua.first_name as competitor_a_first_name, ua.last_name as competitor_a_last_name, 
        ua.display_name as competitor_a_display_name, ua.profile_photo_url as competitor_a_photo,
        cb.user_id as competitor_b_user_id, cb.competitor_number as competitor_b_number,
        ub.first_name as competitor_b_first_name, ub.last_name as competitor_b_last_name, 
        ub.display_name as competitor_b_display_name, ub.profile_photo_url as competitor_b_photo,
        cw.user_id as winner_user_id, cw.competitor_number as winner_number,
        uw.first_name as winner_first_name, uw.last_name as winner_last_name, 
        uw.display_name as winner_display_name
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       LEFT JOIN event_competitors cw ON m.winner_id = cw.id
       LEFT JOIN users uw ON cw.user_id = uw.id
       WHERE m.event_id = $1
    `;

    const params = [eventId];
    let paramIndex = 2;

    if (status) {
      query += ` AND m.status = $${paramIndex++}`;
      params.push(status);
    }

    if (round) {
      query += ` AND m.round_number = $${paramIndex++}`;
      params.push(round);
    }

    query += ' ORDER BY m.round_number, m.match_number';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Get single match
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT m.*, 
        ca.user_id as competitor_a_user_id, ca.competitor_number as competitor_a_number,
        ua.first_name as competitor_a_first_name, ua.last_name as competitor_a_last_name, 
        ua.display_name as competitor_a_display_name, ua.profile_photo_url as competitor_a_photo,
        cb.user_id as competitor_b_user_id, cb.competitor_number as competitor_b_number,
        ub.first_name as competitor_b_first_name, ub.last_name as competitor_b_last_name, 
        ub.display_name as competitor_b_display_name, ub.profile_photo_url as competitor_b_photo,
        cw.user_id as winner_user_id, cw.competitor_number as winner_number,
        uw.first_name as winner_first_name, uw.last_name as winner_last_name, 
        uw.display_name as winner_display_name
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       LEFT JOIN event_competitors cw ON m.winner_id = cw.id
       LEFT JOIN users uw ON cw.user_id = uw.id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

// Start match (update status to in_progress)
router.post('/:id/start', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE matches 
       SET status = 'in_progress', start_time = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = result.rows[0];

    // Emit socket event
    if (global.io) {
      global.io.to(`event_${match.event_id}`).emit('match_started', {
        matchId: id,
        startTime: match.start_time
      });
    }

    res.json({ message: 'Match started', match: result.rows[0] });
  } catch (error) {
    console.error('Start match error:', error);
    res.status(500).json({ error: 'Failed to start match' });
  }
});

// End match with winner
router.post('/:id/complete', authenticate, async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { winnerId, notes } = req.body;

    // Get match info
    const matchResult = await client.query(
      'SELECT * FROM matches WHERE id = $1',
      [id]
    );

    if (matchResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];

    // Validate winner is one of the competitors
    if (winnerId !== match.competitor_a_id && winnerId !== match.competitor_b_id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid winner' });
    }

    const loserId = winnerId === match.competitor_a_id ? match.competitor_b_id : match.competitor_a_id;

    // Update match
    const updateResult = await client.query(
      `UPDATE matches 
       SET status = 'completed', 
           winner_id = $1, 
           loser_id = $2, 
           end_time = CURRENT_TIMESTAMP,
           notes = COALESCE($3, notes)
       WHERE id = $4
       RETURNING *`,
      [winnerId, loserId, notes, id]
    );

    // Update competitor statuses
    await client.query(
      "UPDATE event_competitors SET status = 'eliminated' WHERE id = $1",
      [loserId]
    );

    // Advance winner to next match if applicable
    const nextMatch = await client.query(
      `SELECT * FROM matches 
       WHERE event_id = $1 
       AND round_number = $2 + 1 
       AND (competitor_a_id IS NULL OR competitor_b_id IS NULL)
       ORDER BY match_number
       LIMIT 1`,
      [match.event_id, match.round_number]
    );

    if (nextMatch.rows.length > 0) {
      const next = nextMatch.rows[0];
      const updateField = next.competitor_a_id === null ? 'competitor_a_id' : 'competitor_b_id';
      
      await client.query(
        `UPDATE matches SET ${updateField} = $1 WHERE id = $2`,
        [winnerId, next.id]
      );
    } else {
      // This was the final match
      await client.query(
        "UPDATE event_competitors SET status = 'winner' WHERE id = $1",
        [winnerId]
      );
      
      await client.query(
        "UPDATE events SET status = 'completed' WHERE id = $1",
        [match.event_id]
      );
    }

    await client.query('COMMIT');

    const updatedMatch = updateResult.rows[0];

    // Emit socket events
    if (global.io) {
      global.io.to(`event_${match.event_id}`).emit('match_completed', {
        matchId: id,
        winnerId,
        loserId,
        match: updatedMatch
      });

      global.io.to(`event_${match.event_id}`).emit('bracket_updated', {
        eventId: match.event_id,
        matchId: id,
        winnerId
      });
    }

    res.json({ 
      message: 'Match completed', 
      match: updatedMatch,
      winnerAdvanced: nextMatch.rows.length > 0
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Complete match error:', error);
    res.status(500).json({ error: 'Failed to complete match' });
  } finally {
    client.release();
  }
});

// Update match details (scheduled time, table number, etc.)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledTime, tableNumber, notes } = req.body;

    const result = await db.query(
      `UPDATE matches 
       SET scheduled_time = COALESCE($1, scheduled_time),
           table_number = COALESCE($2, table_number),
           notes = COALESCE($3, notes)
       WHERE id = $4
       RETURNING *`,
      [scheduledTime, tableNumber, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json({ message: 'Match updated', match: result.rows[0] });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({ error: 'Failed to update match' });
  }
});

// Get next upcoming match for an event
router.get('/event/:eventId/next', async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await db.query(
      `SELECT m.*, 
        ca.user_id as competitor_a_user_id, ca.competitor_number as competitor_a_number,
        ua.first_name as competitor_a_first_name, ua.last_name as competitor_a_last_name, ua.display_name as competitor_a_display_name,
        cb.user_id as competitor_b_user_id, cb.competitor_number as competitor_b_number,
        ub.first_name as competitor_b_first_name, ub.last_name as competitor_b_last_name, ub.display_name as competitor_b_display_name
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       WHERE m.event_id = $1 
       AND m.status IN ('scheduled', 'in_progress')
       AND m.competitor_a_id IS NOT NULL 
       AND m.competitor_b_id IS NOT NULL
       ORDER BY m.round_number, m.match_number
       LIMIT 1`,
      [eventId]
    );

    if (result.rows.length === 0) {
      return res.json({ message: 'No upcoming matches', match: null });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get next match error:', error);
    res.status(500).json({ error: 'Failed to fetch next match' });
  }
});

// Get matches for a specific competitor
router.get('/competitor/:competitorId', async (req, res) => {
  try {
    const { competitorId } = req.params;

    const result = await db.query(
      `SELECT m.*, 
        ca.user_id as competitor_a_user_id,
        ua.first_name as competitor_a_first_name, ua.last_name as competitor_a_last_name, ua.display_name as competitor_a_display_name,
        cb.user_id as competitor_b_user_id,
        ub.first_name as competitor_b_first_name, ub.last_name as competitor_b_last_name, ub.display_name as competitor_b_display_name,
        cw.user_id as winner_user_id,
        e.name as event_name, e.date as event_date
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       LEFT JOIN event_competitors cw ON m.winner_id = cw.id
       JOIN events e ON m.event_id = e.id
       WHERE m.competitor_a_id = $1 OR m.competitor_b_id = $1
       ORDER BY m.round_number`,
      [competitorId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get competitor matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

module.exports = router;
