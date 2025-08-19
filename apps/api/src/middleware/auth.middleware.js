const authService = require('../services/auth.service');
const { createError } = require('../utils/error');

/**
 * Middleware d'authentification JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError(401, 'Access token is required for authentication.');
    }

    const decoded = authService.verifyToken(token);
    
    // Attach a lightweight user object to the request
    // The full user object can be fetched by the controller if needed
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    // Pass the error to the global error handler
    next(error);
  }
};

/**
 * Middleware pour vérifier les rôles utilisateur
 */
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        throw createError(401, 'Authentication required.');
      }

      const user = await authService.getCurrentUser(req.user.id);

      if (!roles.includes(user.role)) {
        throw createError(403, 'Insufficient permissions to access this resource.');
      }

      // For convenience, attach the full user object after role check
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware pour vérifier que l'utilisateur est vérifié
 */
const requireVerifiedUser = async (req, res, next) => {
  try {
     if (!req.user || req.user.status !== 'VERIFIED') {
       throw createError(403, 'Account verification is required to perform this action.');
     }
    next();
  } catch(error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireVerifiedUser
};