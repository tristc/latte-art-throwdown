const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all volunteers for an event (organizer/admin only)
router.get('/event/:eventId', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if user is organizer or admin
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
      `SELECT v.*, 
        u.first_name, 
        u.last_name, 
        u.display_name, 
        u.email, 
        u.phone,
        u.profile_photo_url
       FROM volunteers v
       LEFT JOIN users u ON v.user_id = u.id
       WHERE v.event_id = $1
       ORDER BY v.role, u.last_name`,
      [eventId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

// Get volunteer roles
router.get('/roles', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM volunteer_roles WHERE is_active = TRUE ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get volunteer roles error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer roles' });
  }
});

// Register as volunteer (public, but requires auth)
router.post('/', authenticate, async (req, res) => {
  try {
    const { eventId, role, shiftStart, shiftEnd, notes } = req.body;

    // Check if event exists and is accepting volunteers
    const eventCheck = await db.query(
      'SELECT status FROM events WHERE id = $1',
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (eventCheck.rows[0].status === 'cancelled') {
      return res.status(400).json({ error: 'Event is cancelled' });
    }

    // Check if already registered
    const existingCheck = await db.query(
      'SELECT id FROM volunteers WHERE event_id = $1 AND user_id = $2 AND role = $3',
      [eventId, req.user.userId, role]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Already registered as volunteer for this role' });
    }

    const id = uuidv4();

    const result = await db.query(
      `INSERT INTO volunteers (id, event_id, user_id, role, shift_start, shift_end, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, eventId, req.user.userId, role, shiftStart || null, shiftEnd || null, notes || null]
    );

    res.status(201).json({
      message: 'Volunteer registration successful',
      volunteer: result.rows[0]
    });
  } catch (error) {
    console.error('Create volunteer error:', error);
    res.status(500).json({ error: 'Failed to register as volunteer' });
  }
});

// Update volunteer (organizer can update any, volunteer can update own)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, shiftStart, shiftEnd, notes, checkInStatus } = req.body;

    // Get volunteer record
    const volunteerCheck = await db.query(
      'SELECT v.*, e.organizer_id FROM volunteers v JOIN events e ON v.event_id = e.id WHERE v.id = $1',
      [id]
    );

    if (volunteerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    const volunteer = volunteerCheck.rows[0];
    const isOrganizer = volunteer.organizer_id === req.user.userId || req.user.role === 'admin';
    const isSelf = volunteer.user_id === req.user.userId;

    if (!isOrganizer && !isSelf) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Self can only update notes, organizer can update everything
    const updates = {};
    if (isOrganizer) {
      if (role) updates.role = role;
      if (shiftStart !== undefined) updates.shift_start = shiftStart;
      if (shiftEnd !== undefined) updates.shift_end = shiftEnd;
      if (checkInStatus) {
        updates.check_in_status = checkInStatus;
        if (checkInStatus === 'checked_in') {
          updates.check_in_time = new Date().toISOString();
        }
      }
    }
    if (notes !== undefined) updates.notes = notes;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${paramIndex++}`);
      values.push(value);
    }

    values.push(id);

    const result = await db.query(
      `UPDATE volunteers SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({
      message: 'Volunteer updated successfully',
      volunteer: result.rows[0]
    });
  } catch (error) {
    console.error('Update volunteer error:', error);
    res.status(500).json({ error: 'Failed to update volunteer' });
  }
});

// Check-in volunteer (organizer/staff only)
router.post('/:id/checkin', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Get volunteer with event info
    const volunteerCheck = await db.query(
      'SELECT v.*, e.organizer_id FROM volunteers v JOIN events e ON v.event_id = e.id WHERE v.id = $1',
      [id]
    );

    if (volunteerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    const volunteer = volunteerCheck.rows[0];
    const isOrganizer = volunteer.organizer_id === req.user.userId || req.user.role === 'admin';

    if (!isOrganizer) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await db.query(
      `UPDATE volunteers 
       SET check_in_status = 'checked_in', 
           check_in_time = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    // Broadcast update
    if (global.io) {
      global.io.to(`event_${volunteer.event_id}`).emit('volunteer_checked_in', {
        volunteerId: id,
        checkInTime: result.rows[0].check_in_time
      });
    }

    res.json({
      message: 'Volunteer checked in successfully',
      volunteer: result.rows[0]
    });
  } catch (error) {
    console.error('Check-in volunteer error:', error);
    res.status(500).json({ error: 'Failed to check in volunteer' });
  }
});

// Delete volunteer
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const volunteerCheck = await db.query(
      'SELECT v.*, e.organizer_id FROM volunteers v JOIN events e ON v.event_id = e.id WHERE v.id = $1',
      [id]
    );

    if (volunteerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    const volunteer = volunteerCheck.rows[0];
    const isOrganizer = volunteer.organizer_id === req.user.userId || req.user.role === 'admin';
    const isSelf = volunteer.user_id === req.user.userId;

    if (!isOrganizer && !isSelf) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.query('DELETE FROM volunteers WHERE id = $1', [id]);

    res.json({ message: 'Volunteer registration deleted' });
  } catch (error) {
    console.error('Delete volunteer error:', error);
    res.status(500).json({ error: 'Failed to delete volunteer' });
  }
});

// Get my volunteer registrations
router.get('/my-registrations', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT v.*, 
        e.name as event_name, 
        e.date as event_date,
        e.location_name,
        e.status as event_status
       FROM volunteers v
       JOIN events e ON v.event_id = e.id
       WHERE v.user_id = $1
       ORDER BY e.date DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get my volunteer registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer registrations' });
  }
});

// Get volunteer summary for an event (organizer only)
router.get('/event/:eventId/summary', authenticate, async (req, res) => {
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

    // Get summary by role
    const roleSummary = await db.query(
      `SELECT 
        v.role,
        COUNT(*) as total,
        COUNT(CASE WHEN v.check_in_status = 'checked_in' THEN 1 END) as checked_in
       FROM volunteers v
       WHERE v.event_id = $1
       GROUP BY v.role
       ORDER BY v.role`,
      [eventId]
    );

    // Get overall stats
    const stats = await db.query(
      `SELECT 
        COUNT(*) as total_volunteers,
        COUNT(CASE WHEN check_in_status = 'checked_in' THEN 1 END) as checked_in,
        COUNT(CASE WHEN check_in_status = 'no_show' THEN 1 END) as no_shows
       FROM volunteers
       WHERE event_id = $1`,
      [eventId]
    );

    res.json({
      overall: stats.rows[0],
      byRole: roleSummary.rows
    });
  } catch (error) {
    console.error('Get volunteer summary error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer summary' });
  }
});

module.exports = router;
