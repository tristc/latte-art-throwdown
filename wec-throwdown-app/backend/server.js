const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const competitorRoutes = require('./routes/competitors');
const matchRoutes = require('./routes/matches');
const bracketRoutes = require('./routes/brackets');
const scoreRoutes = require('./routes/scores');
const volunteerRoutes = require('./routes/volunteers');
const dashboardRoutes = require('./routes/dashboard');

const { errorHandler } = require('./middleware/errorHandler');
const { socketAuth } = require('./middleware/socketAuth');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/brackets', bracketRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Production: Serve React frontend
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Socket.io connection handling
io.use(socketAuth);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.user?.id || 'anonymous');

  // Join event room for real-time updates
  socket.on('join_event', (eventId) => {
    socket.join(`event_${eventId}`);
    console.log(`Socket ${socket.id} joined event ${eventId}`);
  });

  // Leave event room
  socket.on('leave_event', (eventId) => {
    socket.leave(`event_${eventId}`);
    console.log(`Socket ${socket.id} left event ${eventId}`);
  });

  // Bracket updates
  socket.on('bracket_update', (data) => {
    socket.to(`event_${data.eventId}`).emit('bracket_updated', data);
  });

  // Match updates
  socket.on('match_update', (data) => {
    socket.to(`event_${data.eventId}`).emit('match_updated', data);
  });

  // Score updates
  socket.on('score_update', (data) => {
    socket.to(`event_${data.eventId}`).emit('score_updated', data);
  });

  // Timer updates
  socket.on('timer_update', (data) => {
    socket.to(`event_${data.eventId}`).emit('timer_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available globally for use in controllers
global.io = io;

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 WEC Throwdown API running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});

module.exports = { app, io };
