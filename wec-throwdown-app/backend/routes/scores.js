const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Submit score for a match
router.post('/', authenticate, async (req, res) => {
  try {
    const { matchId, competitorAScores, competitorBScores, notes } = req.body;
    const judgeId = req.user.userId;

    // Get match info
    const matchResult = await db.query(
      'SELECT * FROM matches WHERE id = $1',
      [matchId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];

    // Validate judge is assigned to this match
    if (match.judge_ids && !match.judge_ids.includes(judgeId)) {
      // Allow for now, but could restrict in production
    }

    // Calculate totals
    const competitorATotal = Object.values(competitorAScores).reduce((a, b) => a + b, 0);
    const competitorBTotal = Object.values(competitorBScores).reduce((a, b) => a + b, 0);

    // Determine winner based on score
    let winnerId = null;
    if (competitorATotal > competitorBTotal) {
      winnerId = match.competitor_a_id;
    } else if (competitorBTotal > competitorATotal) {
      winnerId = match.competitor_b_id;
    }
    // If tie, winnerId remains null (could trigger rematch)

    // Check if score already exists for this judge
    const existingScore = await db.query(
      'SELECT id FROM scores WHERE match_id = $1 AND judge_id = $2',
      [matchId, judgeId]
    );

    let scoreResult;
    if (existingScore.rows.length > 0) {
      // Update existing score
      scoreResult = await db.query(
        `UPDATE scores 
         SET competitor_a_scores = $1, competitor_b_scores = $2, winner_id = $3, notes = $4, updated_at = CURRENT_TIMESTAMP
         WHERE match_id = $5 AND judge_id = $6
         RETURNING *`,
        [JSON.stringify(competitorAScores), JSON.stringify(competitorBScores), winnerId, notes, matchId, judgeId]
      );
    } else {
      // Insert new score
      scoreResult = await db.query(
        `INSERT INTO scores (id, match_id, judge_id, competitor_a_id, competitor_b_id, competitor_a_scores, competitor_b_scores, winner_id, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [uuidv4(), matchId, judgeId, match.competitor_a_id, match.competitor_b_id, 
         JSON.stringify(competitorAScores), JSON.stringify(competitorBScores), winnerId, notes]
      );
    }

    // Emit socket event
    if (global.io) {
      global.io.to(`event_${match.event_id}`).emit('score_submitted', {
        matchId,
        judgeId,
        scores: scoreResult.rows[0]
      });
    }

    res.json({
      message: 'Score submitted successfully',
      score: scoreResult.rows[0],
      competitorATotal,
      competitorBTotal,
      winnerId
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get scores for a match
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;

    const result = await db.query(
      `SELECT s.*, 
        u.first_name as judge_first_name, u.last_name as judge_last_name, u.display_name as judge_display_name
       FROM scores s
       JOIN users u ON s.judge_id = u.id
       WHERE s.match_id = $1`,
      [matchId]
    );

    // Calculate aggregate scores
    let competitorAAggregate = {};
    let competitorBAggregate = {};
    let voteCount = { competitorA: 0, competitorB: 0, tie: 0 };

    result.rows.forEach(score => {
      const aScores = score.competitor_a_scores;
      const bScores = score.competitor_b_scores;

      // Aggregate by criteria
      Object.keys(aScores).forEach(key => {
        competitorAAggregate[key] = (competitorAAggregate[key] || 0) + aScores[key];
      });
      Object.keys(bScores).forEach(key => {
        competitorBAggregate[key] = (competitorBAggregate[key] || 0) + bScores[key];
      });

      // Count votes
      const aTotal = Object.values(aScores).reduce((a, b) => a + b, 0);
      const bTotal = Object.values(bScores).reduce((a, b) => a + b, 0);

      if (aTotal > bTotal) voteCount.competitorA++;
      else if (bTotal > aTotal) voteCount.competitorB++;
      else voteCount.tie++;
    });

    // Calculate averages
    const judgeCount = result.rows.length;
    if (judgeCount > 0) {
      Object.keys(competitorAAggregate).forEach(key => {
        competitorAAggregate[key] = competitorAAggregate[key] / judgeCount;
      });
      Object.keys(competitorBAggregate).forEach(key => {
        competitorBAggregate[key] = competitorBAggregate[key] / judgeCount;
      });
    }

    res.json({
      scores: result.rows,
      aggregate: {
        competitorA: competitorAAggregate,
        competitorB: competitorBAggregate
      },
      votes: voteCount,
      totalJudges: judgeCount
    });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Get score criteria for an event
router.get('/criteria/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await db.query(
      `SELECT * FROM score_criteria 
       WHERE event_id = $1 OR event_id IS NULL 
       ORDER BY display_order`,
      [eventId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get criteria error:', error);
    res.status(500).json({ error: 'Failed to fetch criteria' });
  }
});

// Add custom score criteria for an event
router.post('/criteria/:eventId', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, description, maxPoints, weight, displayOrder } = req.body;

    // Check authorization
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

    const result = await db.query(
      `INSERT INTO score_criteria (id, event_id, name, description, max_points, weight, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [uuidv4(), eventId, name, description, maxPoints || 10, weight || 1.0, displayOrder]
    );

    res.status(201).json({
      message: 'Criteria added successfully',
      criteria: result.rows[0]
    });
  } catch (error) {
    console.error('Add criteria error:', error);
    res.status(500).json({ error: 'Failed to add criteria' });
  }
});

// Simple binary choice (winner only, no scores)
router.post('/binary', authenticate, async (req, res) => {
  try {
    const { matchId, winnerId, notes } = req.body;
    const judgeId = req.user.userId;

    // Get match info
    const matchResult = await db.query(
      'SELECT * FROM matches WHERE id = $1',
      [matchId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const match = matchResult.rows[0];

    // Validate winner
    if (winnerId !== match.competitor_a_id && winnerId !== match.competitor_b_id) {
      return res.status(400).json({ error: 'Invalid winner' });
    }

    // Store as score with empty criteria
    const scoreResult = await db.query(
      `INSERT INTO scores (id, match_id, judge_id, competitor_a_id, competitor_b_id, winner_id, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (match_id, judge_id) 
       DO UPDATE SET winner_id = $6, notes = $7, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [uuidv4(), matchId, judgeId, match.competitor_a_id, match.competitor_b_id, winnerId, notes]
    );

    // Emit socket event
    if (global.io) {
      global.io.to(`event_${match.event_id}`).emit('vote_submitted', {
        matchId,
        judgeId,
        winnerId
      });
    }

    res.json({
      message: 'Vote submitted successfully',
      score: scoreResult.rows[0]
    });
  } catch (error) {
    console.error('Binary vote error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

module.exports = router;
