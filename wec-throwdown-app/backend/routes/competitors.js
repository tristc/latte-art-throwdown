const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Register for an event
router.post('/register', authenticate, async (req, res) => {
  try {
    const { eventId, equipmentPreference, milkPreference } = req.body;
    const userId = req.user.userId;

    // Check if event exists and is open for registration
    const eventResult = await db.query(
      'SELECT * FROM events WHERE id = $1',
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResult.rows[0];

    if (event.status !== 'published' && event.status !== 'registration_open') {
      return res.status(400).json({ error: 'Registration is not open for this event' });
    }

    // Check if already registered
    const existingReg = await db.query(
      'SELECT * FROM event_competitors WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (existingReg.rows.length > 0) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Check if event is full
    const countResult = await db.query(
      'SELECT COUNT(*) FROM event_competitors WHERE event_id = $1 AND status != $2',
      [eventId, 'withdrawn']
    );

    const registeredCount = parseInt(countResult.rows[0].count);
    if (registeredCount >= event.max_competitors) {
      return res.status(400).json({ error: 'Event is full' });
    }

    // Register
    const result = await db.query(
      `INSERT INTO event_competitors (id, event_id, user_id, equipment_preference, milk_preference, competitor_number)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [uuidv4(), eventId, userId, equipmentPreference || null, milkPreference || null, registeredCount + 1]
    );

    res.status(201).json({
      message: 'Registration successful',
      registration: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Cancel registration
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.userId;

    const result = await db.query(
      "UPDATE event_competitors SET status = 'withdrawn' WHERE event_id = $1 AND user_id = $2 RETURNING *",
      [eventId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ message: 'Registration cancelled', registration: result.rows[0] });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

// Check-in competitor (staff/organizer only)
router.post('/checkin', authenticate, async (req, res) => {
  try {
    const { competitorId } = req.body;

    // Get competitor info
    const competitorResult = await db.query(
      'SELECT * FROM event_competitors WHERE id = $1',
      [competitorId]
    );

    if (competitorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Competitor not found' });
    }

    const competitor = competitorResult.rows[0];

    // Check authorization (organizer or volunteer)
    const eventResult = await db.query(
      'SELECT organizer_id FROM events WHERE id = $1',
      [competitor.event_id]
    );

    const isOrganizer = eventResult.rows[0]?.organizer_id === req.user.userId;
    const isVolunteer = await db.query(
      'SELECT * FROM volunteers WHERE event_id = $1 AND user_id = $2',
      [competitor.event_id, req.user.userId]
    );

    if (!isOrganizer && isVolunteer.rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await db.query(
      "UPDATE event_competitors SET check_in_status = 'checked_in', check_in_time = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [competitorId]
    );

    // Generate QR code data for future reference
    const qrData = JSON.stringify({
      competitorId: competitorId,
      eventId: competitor.event_id,
      userId: competitor.user_id
    });

    res.json({
      message: 'Check-in successful',
      competitor: result.rows[0],
      qrData
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Check-in failed' });
  }
});

// Get all competitors for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;

    let query = `
      SELECT ec.*, 
        u.first_name, u.last_name, u.display_name, u.email, u.profile_photo_url, 
        u.skill_level, u.instagram_handle
       FROM event_competitors ec
       JOIN users u ON ec.user_id = u.id
       WHERE ec.event_id = $1
    `;

    const params = [eventId];

    if (status) {
      query += ' AND ec.status = $2';
      params.push(status);
    }

    query += ' ORDER BY ec.competitor_number';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get competitors error:', error);
    res.status(500).json({ error: 'Failed to fetch competitors' });
  }
});

// Get my registrations (for logged-in user)
router.get('/my-registrations', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(
      `SELECT ec.*, 
        e.name as event_name, e.date as event_date, e.location_name, e.status as event_status
       FROM event_competitors ec
       JOIN events e ON ec.event_id = e.id
       WHERE ec.user_id = $1 AND ec.status != 'withdrawn'
       ORDER BY e.date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Update competitor details (organizer only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { competitorNumber, seedPosition, status, equipmentPreference } = req.body;

    // Check authorization
    const competitorResult = await db.query(
      'SELECT event_id FROM event_competitors WHERE id = $1',
      [id]
    );

    if (competitorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Competitor not found' });
    }

    const eventId = competitorResult.rows[0].event_id;
    const eventResult = await db.query(
      'SELECT organizer_id FROM events WHERE id = $1',
      [eventId]
    );

    if (eventResult.rows[0].organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await db.query(
      `UPDATE event_competitors 
       SET competitor_number = COALESCE($1, competitor_number),
           seed_position = COALESCE($2, seed_position),
           status = COALESCE($3, status),
           equipment_preference = COALESCE($4, equipment_preference)
       WHERE id = $5
       RETURNING *`,
      [competitorNumber, seedPosition, status, equipmentPreference, id]
    );

    res.json({ message: 'Competitor updated', competitor: result.rows[0] });
  } catch (error) {
    console.error('Update competitor error:', error);
    res.status(500).json({ error: 'Failed to update competitor' });
  }
});

module.exports = router;
