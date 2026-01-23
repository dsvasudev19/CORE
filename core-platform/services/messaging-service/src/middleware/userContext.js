const logger = require('../utils/logger');

/**
 * User Context Middleware
 * 
 * Extracts user context from headers sent by core-service.
 * This replaces JWT authentication since core-service handles all auth.
 * 
 * Expected headers from core-service:
 * - X-User-Id: User's ID
 * - X-User-Name: User's name
 * - X-User-Email: User's email
 * - X-Organization-Id: Organization ID
 */
exports.extractUserContext = (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const userName = req.headers['x-user-name'];
    const userEmail = req.headers['x-user-email'];
    const organizationId = req.headers['x-organization-id'];

    // Validate required headers
    if (!userId || !organizationId) {
      logger.warn('Missing required user context headers', {
        userId,
        organizationId,
        path: req.path
      });
      return res.status(400).json({
        error: 'Missing required user context headers',
        required: ['X-User-Id', 'X-Organization-Id']
      });
    }

    // Attach user context to request
    req.user = {
      userId: parseInt(userId),
      userName: userName || 'Unknown User',
      email: userEmail || '',
      organizationId: parseInt(organizationId)
    };

    logger.debug('User context extracted', {
      userId: req.user.userId,
      userName: req.user.userName,
      organizationId: req.user.organizationId,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Error extracting user context', {
      error: error.message,
      headers: req.headers
    });
    res.status(500).json({
      error: 'Failed to extract user context'
    });
  }
};

/**
 * Optional: Middleware to validate that request is coming from core-service
 * This adds an extra layer of security by checking the source
 */
exports.validateInternalRequest = (req, res, next) => {
  const trustedProxy = process.env.TRUSTED_PROXY || 'core-service';
  const internalNetworkOnly = process.env.INTERNAL_NETWORK_ONLY === 'true';

  if (internalNetworkOnly) {
    // In production, you might want to check IP address or other identifiers
    // For now, we'll just log a warning if not from trusted source
    const forwardedFor = req.headers['x-forwarded-for'];
    const remoteAddress = req.connection.remoteAddress;

    logger.debug('Request source validation', {
      forwardedFor,
      remoteAddress,
      trustedProxy
    });

    // Add your IP whitelist logic here if needed
    // For example:
    // const allowedIPs = ['127.0.0.1', '::1', 'core-service-ip'];
    // if (!allowedIPs.includes(remoteAddress)) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }
  }

  next();
};
