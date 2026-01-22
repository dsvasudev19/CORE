require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const SocketHandler = require('./sockets/socketHandler');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.SOCKET_IO_CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

// Initialize Socket.IO handler
new SocketHandler(io);

// Database connection
sequelize.authenticate()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error) => {
    logger.error('Unable to connect to database', { error: error.message });
    process.exit(1);
  });

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'healthy',
      service: 'messaging-app',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'messaging-app',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Messaging app running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');

  server.close(() => {
    logger.info('HTTP server closed');
  });

  await sequelize.close();
  logger.info('Database connection closed');

  process.exit(0);
});

module.exports = { app, server, io };

