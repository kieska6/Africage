const { errorResponse } = require('../utils/response');

/**
 * Middleware global de gestion des erreurs
 */
const errorMiddleware = (error, req, res, next) => {
  console.error('Error:', error);

  // Erreur Prisma
  if (error.code && error.code.startsWith('P')) {
    switch (error.code) {
      case 'P2002':
        return errorResponse(res, 'Duplicate entry found', 409);
      case 'P2025':
        return errorResponse(res, 'Record not found', 404);
      default:
        return errorResponse(res, 'Database error', 500);
    }
  }

  // Erreur JWT
  if (error.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (error.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Erreur de validation
  if (error.name === 'ValidationError') {
    return errorResponse(res, 'Validation error', 400, error.details);
  }

  // Erreur par défaut
  return errorResponse(res, 'Internal server error', 500);
};

module.exports = errorMiddleware;