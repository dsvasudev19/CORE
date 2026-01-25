import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import {logger} from './config/logger.js';
import {errorHandler} from './middleware/errorHandler.js';
import {authMiddleware} from './middleware/auth.js';
import neonRoutes from './routes/neon.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(morgan('combined', {stream: {write: message => logger.info(message.trim())}}));

// Health check
app.get('/health', (req, res) => {
    res.json({status: 'healthy', service: 'neon-service', timestamp: new Date().toISOString()});
});

// Routes
app.use('/api/neon', authMiddleware, neonRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Neon Service running on port ${ PORT }`);
    logger.info(`📡 Environment: ${ process.env.NODE_ENV }`);
    logger.info(`🔗 MCP Server: ${ process.env.MCP_SERVER_URL }`);
});

export default app;
