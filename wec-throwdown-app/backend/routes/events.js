const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const { status, dateFrom, dateTo, location, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT e.*, 
        u.first_name as organizer_first_name, 
        u.last_name as organizer_last_name,
        u.display_name as organizer_display_name,
        (SELECT COUNT(*) FROM event_competitors ec WHERE ec.event_id = e.id) as registered_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.status != 'draft'
    `;
    
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND e.status = $${paramIndex++}`;
      params.push(status);
    }

    if (dateFrom) {
      query += ` AND e.date >= $${paramIndex++}`;
      params.push(dateFrom);
    }

    if (dateTo) {
      query += ` AND e.date <= $${paramIndex++}`;
      params.push(dateTo);
    }

    if (location) {
      query += ` AND (e.location_city ILIKE $${paramIndex} OR e.location_country ILIKE $${paramIndex})`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    query += ` ORDER BY e.date ASC, e.start_time ASC`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, (page - 1) * limit);

    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM events e WHERE e.status != 'draft'`;
    if (status) countQuery += ` AND e.status = '${status}'`;
    const countResult = await db.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      events: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const eventResult = await db.query(
      `SELECT e.*, 
        u.first_name as organizer_first_name, 
        u.last_name as organizer_last_name,
        u.display_name as organizer_display_name
       FROM events e
       LEFT JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1`,
      [id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResult.rows[0];

    // Get registered competitors count
    const countResult = await db.query(
      'SELECT COUNT(*) as count FROM event_competitors WHERE event_id = $1 AND status != $2',
      [id, 'withdrawn']
    );

    // Get score criteria
    const criteriaResult = await db.query(
      'SELECT * FROM score_criteria WHERE event_id = $1 OR event_id IS NULL ORDER BY display_order',
      [id]
    );

    res.json({
      ...event,
      registeredCount: parseInt(countResult.rows[0].count),
      scoreCriteria: criteriaResult.rows
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (organizers only)
router.post('/', authenticate, requireRole('organizer'), async (req, res) => {
  try {
    const {
      name,
      description,
      date,
      startTime,
      endTime,
      locationName,
      locationAddress,
      locationCity,
      locationCountry,
      format,
      bracketSize,
      maxCompetitors,
      registrationFee,
      registrationOpens,
      registrationCloses,
      rules,
      equipmentProvided,
      timeLimitMinutes,
      patternType
    } = req.body;

    const id = uuidv4();
    
    const result = await db.query(
      `INSERT INTO events (
        id, name, description, date, start_time, end_time,
        location_name, location_address, location_city, location_country,
        format, bracket_size, max_competitors, registration_fee,
        registration_opens, registration_closes, status,
        rules, equipment_provided, time_limit_minutes, pattern_type, organizer_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *`,
      [
        id, name, description, date, startTime, endTime,
        locationName, locationAddress, locationCity, locationCountry,
        format || 'single_elimination', bracketSize || 16, maxCompetitors, registrationFee || 0,
        registrationOpens, registrationCloses, 'published',
        rules, equipmentProvided, timeLimitMinutes || 4, patternType || 'free_pour', req.user.userId
      ]
    );

    // Copy default score criteria for this event
    await db.query(
      `INSERT INTO score_criteria (event_id, name, description, max_points, weight, display_order)
       SELECT $1, name, description, max_points, weight, display_order
       FROM score_criteria WHERE event_id IS NULL`,
      [id]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is organizer or admin
    const eventCheck = await db.query(
      'SELECT organizer_id FROM events WHERE id = $1',
      [id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (eventCheck.rows[0].organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const updates = req.body;
    const allowedFields = [
      'name', 'description', 'date', 'start_time', 'end_time',
      'location_name', 'location_address', 'location_city', 'location_country',
      'format', 'bracket_size', 'max_competitors', 'registration_fee',
      'registration_opens', 'registration_closes', 'status',
      'rules', 'equipment_provided', 'time_limit_minutes', 'pattern_type'
    ];

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        setClauses.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);

    const result = await db.query(
      `UPDATE events SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({
      message: 'Event updated successfully',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const eventCheck = await db.query(
      'SELECT organizer_id FROM events WHERE id = $1',
      [id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (eventCheck.rows[0].organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await db.query('DELETE FROM events WHERE id = $1', [id]);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get event statistics (organizer only)
router.get('/:id/stats', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const eventCheck = await db.query(
      'SELECT organizer_id FROM events WHERE id = $1',
      [id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (eventCheck.rows[0].organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Get various stats
    const stats = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM event_competitors WHERE event_id = $1) as total_registrations,
        (SELECT COUNT(*) FROM event_competitors WHERE event_id = $1 AND check_in_status = 'checked_in') as checked_in,
        (SELECT COUNT(*) FROM event_competitors WHERE event_id = $1 AND status = 'withdrawn') as withdrawn,
        (SELECT COUNT(*) FROM matches WHERE event_id = $1) as total_matches,
        (SELECT COUNT(*) FROM matches WHERE event_id = $1 AND status = 'completed') as completed_matches,
        (SELECT COUNT(*) FROM volunteers WHERE event_id = $1) as total_volunteers`,
      [id]
    );

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
