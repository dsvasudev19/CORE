const { verifyToken } = require('../utils/auth');
const logger = require('../utils/logger');

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    req.user = {
      userId: decoded.userId,
      userName: decoded.userName,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
