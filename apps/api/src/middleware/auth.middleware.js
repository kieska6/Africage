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
      return errorResponse(res, 'Token d\'accès requis', 401);
    }

    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdentityVerified: true
      }
    });
    
    if (!user) {
      return errorResponse(res, 'Utilisateur non trouvé', 401);
    }

    if (user.status === 'SUSPENDED') {
      return errorResponse(res, 'Compte suspendu', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token invalide', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expiré', 401);
    }
    return errorResponse(res, 'Erreur d\'authentification', 401);
  }
};

/**
 * Middleware pour vérifier les rôles utilisateur
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 'Permissions insuffisantes', 403);
    }
    next();
  };
};

/**
 * Middleware pour vérifier que l'utilisateur est vérifié
 */
const requireVerifiedUser = (req, res, next) => {
  if (!req.user || req.user.status !== 'VERIFIED') {
    return errorResponse(res, 'Vérification du compte requise', 403);
  }
  next();
};

/**
 * Middleware pour vérifier l'email
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user || !req.user.isEmailVerified) {
    return errorResponse(res, 'Vérification de l\'email requise', 403);
  }
  next();
};

/**
 * Middleware pour vérifier le téléphone
 */
const requirePhoneVerified = (req, res, next) => {
  if (!req.user || !req.user.isPhoneVerified) {
    return errorResponse(res, 'Vérification du téléphone requise', 403);
  }
  next();
};

/**
 * Middleware pour vérifier l'identité (KYC)
 */
const requireIdentityVerified = (req, res, next) => {
  if (!req.user || !req.user.isIdentityVerified) {
    return errorResponse(res, 'Vérification d\'identité requise', 403);
  }
  next();
};

/**
 * Middleware optionnel d'authentification (n'échoue pas si pas de token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true
      }
    });
    
    req.user = user;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireVerifiedUser,
  requireEmailVerified,
  requirePhoneVerified,
  requireIdentityVerified,
  optionalAuth
};