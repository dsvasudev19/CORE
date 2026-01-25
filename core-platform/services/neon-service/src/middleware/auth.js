import jwt from 'jsonwebtoken';
import {logger} from '../config/logger.js';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({error: 'No token provided'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('Auth error:', error);
        return res.status(401).json({error: 'Invalid token'});
    }
};

export const optionalAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        logger.warn('Optional auth failed:', error.message);
        next();
    }
};
