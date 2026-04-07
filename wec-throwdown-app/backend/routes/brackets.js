const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Generate bracket for an event
router.post('/generate/:eventId', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { seeding = 'random' } = req.body; // 'random', 'skill', 'manual'

    // Check authorization
    const eventCheck = await db.query(
      'SELECT organizer_id, bracket_size, status FROM events WHERE id = $1',
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventCheck.rows[0];
    
    if (event.organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Get all checked-in competitors
    const competitorsResult = await db.query(
      `SELECT ec.id, ec.user_id, ec.competitor_number, u.first_name, u.last_name, u.display_name, u.skill_level
       FROM event_competitors ec
       JOIN users u ON ec.user_id = u.id
       WHERE ec.event_id = $1 AND ec.check_in_status = 'checked_in'
       ORDER BY ec.competitor_number`,
      [eventId]
    );

    const competitors = competitorsResult.rows;
    const bracketSize = event.bracket_size;

    if (competitors.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 checked-in competitors' });
    }

    if (competitors.length > bracketSize) {
      return res.status(400).json({ 
        error: `Too many competitors. Bracket size is ${bracketSize}, but ${competitors.length} checked in.` 
      });
    }

    // Clear existing matches for this event
    await db.query('DELETE FROM matches WHERE event_id = $1', [eventId]);

    // Generate bracket based on format
    const matches = [];
    const format = event.format || 'single_elimination';

    if (format === 'single_elimination') {
      matches.push(...generateSingleElimination(eventId, competitors, bracketSize));
    } else if (format === 'double_elimination') {
      matches.push(...generateDoubleElimination(eventId, competitors, bracketSize));
    } else {
      return res.status(400).json({ error: 'Unsupported format' });
    }

    // Insert all matches
    for (const match of matches) {
      await db.query(
        `INSERT INTO matches (id, event_id, round_number, match_number, bracket_side, competitor_a_id, competitor_b_id, scheduled_time, time_limit_seconds)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [uuidv4(), match.eventId, match.round, match.matchNumber, match.bracketSide, 
         match.competitorA, match.competitorB, match.scheduledTime, match.timeLimit]
      );
    }

    // Update event status
    await db.query(
      "UPDATE events SET status = 'in_progress' WHERE id = $1",
      [eventId]
    );

    // Get generated bracket
    const bracketResult = await db.query(
      `SELECT m.*, 
        ca.user_id as competitor_a_user_id, ca.competitor_number as competitor_a_number,
        ua.first_name as competitor_a_first_name, ua.last_name as competitor_a_last_name, ua.display_name as competitor_a_display_name,
        cb.user_id as competitor_b_user_id, cb.competitor_number as competitor_b_number,
        ub.first_name as competitor_b_first_name, ub.last_name as competitor_b_last_name, ub.display_name as competitor_b_display_name,
        cw.user_id as winner_user_id, cw.competitor_number as winner_number,
        uw.first_name as winner_first_name, uw.last_name as winner_last_name, uw.display_name as winner_display_name
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       LEFT JOIN event_competitors cw ON m.winner_id = cw.id
       LEFT JOIN users uw ON cw.user_id = uw.id
       WHERE m.event_id = $1
       ORDER BY m.round_number, m.match_number`,
      [eventId]
    );

    // Emit socket event for real-time updates
    if (global.io) {
      global.io.to(`event_${eventId}`).emit('bracket_generated', {
        eventId,
        matches: bracketResult.rows
      });
    }

    res.json({
      message: 'Bracket generated successfully',
      bracket: bracketResult.rows,
      format,
      totalCompetitors: competitors.length,
      bracketSize
    });
  } catch (error) {
    console.error('Generate bracket error:', error);
    res.status(500).json({ error: 'Failed to generate bracket' });
  }
});

// Get bracket for an event
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const bracketResult = await db.query(
      `SELECT m.*, 
        ca.user_id as competitor_a_user_id, ca.competitor_number as competitor_a_number,
        ua.first_name as competitor_a_first_name, ua.last_name as competitor_a_last_name, ua.display_name as competitor_a_display_name,
        ua.profile_photo_url as competitor_a_photo,
        cb.user_id as competitor_b_user_id, cb.competitor_number as competitor_b_number,
        ub.first_name as competitor_b_first_name, ub.last_name as competitor_b_last_name, ub.display_name as competitor_b_display_name,
        ub.profile_photo_url as competitor_b_photo,
        cw.user_id as winner_user_id, cw.competitor_number as winner_number,
        uw.first_name as winner_first_name, uw.last_name as winner_last_name, uw.display_name as winner_display_name
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       LEFT JOIN event_competitors cw ON m.winner_id = cw.id
       LEFT JOIN users uw ON cw.user_id = uw.id
       WHERE m.event_id = $1
       ORDER BY m.round_number, m.match_number`,
      [eventId]
    );

    // Get event info
    const eventResult = await db.query(
      'SELECT format, bracket_size, status FROM events WHERE id = $1',
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      event: eventResult.rows[0],
      matches: bracketResult.rows
    });
  } catch (error) {
    console.error('Get bracket error:', error);
    res.status(500).json({ error: 'Failed to fetch bracket' });
  }
});

// Helper function: Generate single elimination bracket
function generateSingleElimination(eventId, competitors, bracketSize) {
  const matches = [];
  const numRounds = Math.log2(bracketSize);
  
  // Pad competitors array with byes if needed
  const paddedCompetitors = [...competitors];
  while (paddedCompetitors.length < bracketSize) {
    paddedCompetitors.push(null); // bye
  }

  // Shuffle for random seeding (or sort by skill level if that option selected)
  for (let i = paddedCompetitors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paddedCompetitors[i], paddedCompetitors[j]] = [paddedCompetitors[j], paddedCompetitors[i]];
  }

  let matchNumber = 1;
  let currentRoundCompetitors = paddedCompetitors;

  for (let round = 1; round <= numRounds; round++) {
    const roundMatches = [];
    const nextRoundCompetitors = [];

    for (let i = 0; i < currentRoundCompetitors.length; i += 2) {
      const compA = currentRoundCompetitors[i];
      const compB = currentRoundCompetitors[i + 1];

      // Handle byes
      if (compA && !compB) {
        nextRoundCompetitors.push(compA);
      } else if (!compA && compB) {
        nextRoundCompetitors.push(compB);
      } else {
        roundMatches.push({
          eventId,
          round,
          matchNumber: matchNumber++,
          bracketSide: 'winners',
          competitorA: compA ? compA.id : null,
          competitorB: compB ? compB.id : null,
          scheduledTime: null,
          timeLimit: 240 // 4 minutes default
        });
        nextRoundCompetitors.push(null); // Placeholder for winner
      }
    }

    matches.push(...roundMatches);
    currentRoundCompetitors = nextRoundCompetitors;
  }

  return matches;
}

// Helper function: Generate double elimination bracket
function generateDoubleElimination(eventId, competitors, bracketSize) {
  // Simplified double elimination - winners bracket + one losers round
  const matches = [];
  
  // Generate winners bracket (same as single elimination)
  const winnersMatches = generateSingleElimination(eventId, competitors, bracketSize);
  
  // Mark all as winners bracket
  winnersMatches.forEach(m => {
    m.bracketSide = 'winners';
    matches.push(m);
  });

  // Generate placeholder matches for losers bracket
  const numLosersMatches = Math.floor(competitors.length / 2);
  for (let i = 1; i <= numLosersMatches; i++) {
    matches.push({
      eventId,
      round: i,
      matchNumber: i,
      bracketSide: 'losers',
      competitorA: null,
      competitorB: null,
      scheduledTime: null,
      timeLimit: 240
    });
  }

  // Add grand final placeholder
  matches.push({
    eventId,
    round: 999,
    matchNumber: 1,
    bracketSide: 'final',
    competitorA: null,
    competitorB: null,
    scheduledTime: null,
    timeLimit: 240
  });

  return matches;
}

// Reset bracket (delete all matches)
router.post('/reset/:eventId', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const eventCheck = await db.query(
      'SELECT organizer_id FROM events WHERE id = $1',
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (eventCheck.rows[0].organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.query('DELETE FROM matches WHERE event_id = $1', [eventId]);
    await db.query(
      "UPDATE events SET status = 'registration_closed' WHERE id = $1",
      [eventId]
    );

    res.json({ message: 'Bracket reset successfully' });
  } catch (error) {
    console.error('Reset bracket error:', error);
    res.status(500).json({ error: 'Failed to reset bracket' });
  }
});

module.exports = router;
