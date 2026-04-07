const express = require('express');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get organizer dashboard summary
router.get('/organizer', authenticate, requireRole('organizer'), async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get counts
    const stats = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM events WHERE organizer_id = $1) as total_events,
        (SELECT COUNT(*) FROM events WHERE organizer_id = $1 AND status = 'published') as published_events,
        (SELECT COUNT(*) FROM events WHERE organizer_id = $1 AND status = 'in_progress') as active_events,
        (SELECT COUNT(*) FROM events WHERE organizer_id = $1 AND status = 'completed') as completed_events`,
      [userId]
    );

    // Get recent events
    const recentEvents = await db.query(
      `SELECT e.*, 
        (SELECT COUNT(*) FROM event_competitors WHERE event_id = e.id) as competitor_count
       FROM events e
       WHERE e.organizer_id = $1
       ORDER BY e.created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Get upcoming events
    const upcomingEvents = await db.query(
      `SELECT e.*,
        (SELECT COUNT(*) FROM event_competitors WHERE event_id = e.id AND status != 'withdrawn') as registered_count,
        (SELECT COUNT(*) FROM event_competitors WHERE event_id = e.id AND check_in_status = 'checked_in') as checked_in_count
       FROM events e
       WHERE e.organizer_id = $1 
         AND e.date >= CURRENT_DATE
         AND e.status IN ('published', 'registration_open', 'in_progress')
       ORDER BY e.date ASC
       LIMIT 5`,
      [userId]
    );

    res.json({
      stats: stats.rows[0],
      recentEvents: recentEvents.rows,
      upcomingEvents: upcomingEvents.rows
    });
  } catch (error) {
    console.error('Get organizer dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get event dashboard (detailed view for specific event)
router.get('/event/:eventId', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;

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

    // Get event details
    const eventResult = await db.query(
      `SELECT e.*,
        (SELECT COUNT(*) FROM event_competitors WHERE event_id = e.id AND status != 'withdrawn') as registered_count,
        (SELECT COUNT(*) FROM event_competitors WHERE event_id = e.id AND check_in_status = 'checked_in') as checked_in_count,
        (SELECT COUNT(*) FROM volunteers WHERE event_id = e.id) as volunteer_count,
        (SELECT COUNT(*) FROM volunteers WHERE event_id = e.id AND check_in_status = 'checked_in') as volunteers_checked_in
       FROM events e
       WHERE e.id = $1`,
      [eventId]
    );

    // Get bracket progress
    const bracketProgress = await db.query(
      `SELECT 
        COUNT(*) as total_matches,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_matches,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_matches,
        MAX(round_number) as current_round
       FROM matches
       WHERE event_id = $1`,
      [eventId]
    );

    // Get recent activity (last 10 matches completed)
    const recentMatches = await db.query(
      `SELECT m.*,
        ca.competitor_number as competitor_a_number,
        cb.competitor_number as competitor_b_number,
        ua.first_name as competitor_a_first_name,
        ua.last_name as competitor_a_last_name,
        ub.first_name as competitor_b_first_name,
        ub.last_name as competitor_b_last_name
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       WHERE m.event_id = $1 AND m.status = 'completed'
       ORDER BY m.end_time DESC
       LIMIT 10`,
      [eventId]
    );

    // Get registration timeline (last 7 days)
    const registrationTimeline = await db.query(
      `SELECT DATE(registration_date) as date, COUNT(*) as count
       FROM event_competitors
       WHERE event_id = $1 
         AND registration_date >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(registration_date)
       ORDER BY date`,
      [eventId]
    );

    // Get skill level breakdown
    const skillBreakdown = await db.query(
      `SELECT u.skill_level, COUNT(*) as count
       FROM event_competitors ec
       JOIN users u ON ec.user_id = u.id
       WHERE ec.event_id = $1 AND ec.status != 'withdrawn'
       GROUP BY u.skill_level
       ORDER BY count DESC`,
      [eventId]
    );

    res.json({
      event: eventResult.rows[0],
      bracket: bracketProgress.rows[0],
      recentMatches: recentMatches.rows,
      registrationTimeline: registrationTimeline.rows,
      skillBreakdown: skillBreakdown.rows
    });
  } catch (error) {
    console.error('Get event dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch event dashboard' });
  }
});

// Get competitor dashboard
router.get('/competitor', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get upcoming events registered for
    const upcomingEvents = await db.query(
      `SELECT e.*, ec.status as competitor_status, ec.check_in_status
       FROM event_competitors ec
       JOIN events e ON ec.event_id = e.id
       WHERE ec.user_id = $1 
         AND e.date >= CURRENT_DATE
         AND ec.status != 'withdrawn'
       ORDER BY e.date ASC`,
      [userId]
    );

    // Get past events
    const pastEvents = await db.query(
      `SELECT e.*, ec.status as competitor_status
       FROM event_competitors ec
       JOIN events e ON ec.event_id = e.id
       WHERE ec.user_id = $1 
         AND e.date < CURRENT_DATE
         AND ec.status != 'withdrawn'
       ORDER BY e.date DESC
       LIMIT 5`,
      [userId]
    );

    // Get match history
    const matchHistory = await db.query(
      `SELECT m.*, e.name as event_name, e.date as event_date,
        CASE 
          WHEN m.winner_id = ec.id THEN 'won'
          WHEN m.loser_id = ec.id THEN 'lost'
          ELSE 'pending'
        END as result
       FROM matches m
       JOIN event_competitors ec ON (m.competitor_a_id = ec.id OR m.competitor_b_id = ec.id)
       JOIN events e ON m.event_id = e.id
       WHERE ec.user_id = $1 AND m.status = 'completed'
       ORDER BY m.end_time DESC
       LIMIT 10`,
      [userId]
    );

    // Get stats
    const stats = await db.query(
      `SELECT 
        (SELECT COUNT(DISTINCT event_id) FROM event_competitors WHERE user_id = $1 AND status != 'withdrawn') as total_events,
        (SELECT COUNT(*) FROM matches m JOIN event_competitors ec ON m.winner_id = ec.id WHERE ec.user_id = $1) as matches_won,
        (SELECT COUNT(*) FROM matches m JOIN event_competitors ec ON m.loser_id = ec.id WHERE ec.user_id = $1) as matches_lost`,
      [userId]
    );

    res.json({
      upcomingEvents: upcomingEvents.rows,
      pastEvents: pastEvents.rows,
      matchHistory: matchHistory.rows,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error('Get competitor dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch competitor dashboard' });
  }
});

// Get admin dashboard (admin only)
router.get('/admin', authenticate, requireRole('admin'), async (req, res) => {
  try {
    // Platform-wide stats
    const stats = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'organizer') as organizer_count,
        (SELECT COUNT(*) FROM events) as total_events,
        (SELECT COUNT(*) FROM events WHERE status = 'published') as published_events,
        (SELECT COUNT(*) FROM events WHERE status = 'in_progress') as active_events,
        (SELECT COUNT(*) FROM event_competitors) as total_registrations,
        (SELECT COUNT(*) FROM matches WHERE status = 'completed') as completed_matches`,
    );

    // Recent events
    const recentEvents = await db.query(
      `SELECT e.*, u.first_name as organizer_first_name, u.last_name as organizer_last_name
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       ORDER BY e.created_at DESC
       LIMIT 10`
    );

    // Recent registrations
    const recentRegistrations = await db.query(
      `SELECT ec.*, e.name as event_name, u.first_name, u.last_name
       FROM event_competitors ec
       JOIN events e ON ec.event_id = e.id
       JOIN users u ON ec.user_id = u.id
       ORDER BY ec.registration_date DESC
       LIMIT 10`
    );

    // Events by month (last 6 months)
    const eventsByMonth = await db.query(
      `SELECT DATE_TRUNC('month', date) as month, COUNT(*) as count
       FROM events
       WHERE date >= CURRENT_DATE - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', date)
       ORDER BY month`
    );

    res.json({
      stats: stats.rows[0],
      recentEvents: recentEvents.rows,
      recentRegistrations: recentRegistrations.rows,
      eventsByMonth: eventsByMonth.rows
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard' });
  }
});

// Get live scoreboard for an event (public)
router.get('/event/:eventId/scoreboard', async (req, res) => {
  try {
    const { eventId } = req.params;

    // Get current round info
    const currentRound = await db.query(
      `SELECT 
        MAX(round_number) as current_round,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as active_matches
       FROM matches
       WHERE event_id = $1`,
      [eventId]
    );

    // Get active matches
    const activeMatches = await db.query(
      `SELECT m.*,
        ca.competitor_number as competitor_a_number,
        cb.competitor_number as competitor_b_number,
        ua.display_name as competitor_a_name,
        ub.display_name as competitor_b_name,
        ua.profile_photo_url as competitor_a_photo,
        ub.profile_photo_url as competitor_b_photo
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       WHERE m.event_id = $1 AND m.status = 'in_progress'
       ORDER BY m.round_number, m.match_number`,
      [eventId]
    );

    // Get recent results
    const recentResults = await db.query(
      `SELECT m.*,
        ca.competitor_number as competitor_a_number,
        cb.competitor_number as competitor_b_number,
        ua.display_name as competitor_a_name,
        ub.display_name as competitor_b_name,
        winner.competitor_number as winner_number,
        winner_user.display_name as winner_name
       FROM matches m
       LEFT JOIN event_competitors ca ON m.competitor_a_id = ca.id
       LEFT JOIN event_competitors cb ON m.competitor_b_id = cb.id
       LEFT JOIN users ua ON ca.user_id = ua.id
       LEFT JOIN users ub ON cb.user_id = ub.id
       LEFT JOIN event_competitors winner ON m.winner_id = winner.id
       LEFT JOIN users winner_user ON winner.user_id = winner_user.id
       WHERE m.event_id = $1 AND m.status = 'completed'
       ORDER BY m.end_time DESC
       LIMIT 5`,
      [eventId]
    );

    // Get remaining competitors count
    const remainingCount = await db.query(
      `SELECT COUNT(*) as count
       FROM event_competitors
       WHERE event_id = $1 AND status = 'active'`,
      [eventId]
    );

    res.json({
      currentRound: currentRound.rows[0],
      activeMatches: activeMatches.rows,
      recentResults: recentResults.rows,
      remainingCompetitors: parseInt(remainingCount.rows[0].count)
    });
  } catch (error) {
    console.error('Get scoreboard error:', error);
    res.status(500).json({ error: 'Failed to fetch scoreboard' });
  }
});

module.exports = router;
