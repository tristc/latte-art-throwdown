const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../routes/auth');

// Socket.io authentication middleware
const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      // Allow anonymous connections for public features
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    socket.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    // Allow connection but without user data
    next();
  }
};

module.exports = {
  socketAuth
};
