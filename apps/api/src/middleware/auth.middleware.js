const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const prisma = require('../utils/prisma');

/**
 * Middleware d'authentification JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return errorResponse(res, 'Access token required', 401);
    }

    // TODO: Implement JWT verification
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    
    // if (!user) {
    //   return errorResponse(res, 'User not found', 401);
    // }

    // req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

/**
 * Middleware pour vérifier les rôles utilisateur
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    // TODO: Implement role verification
    // if (!req.user || !roles.includes(req.user.role)) {
    //   return errorResponse(res, 'Insufficient permissions', 403);
    // }
    next();
  };
};

/**
 * Middleware pour vérifier que l'utilisateur est vérifié
 */
const requireVerifiedUser = (req, res, next) => {
  // TODO: Implement user verification check
  // if (!req.user || req.user.status !== 'VERIFIED') {
  //   return errorResponse(res, 'Account verification required', 403);
  // }
  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireVerifiedUser
};