const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

/**
 * Middleware pour valider les données d'entrée
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return errorResponse(res, 'Validation failed', 400, formattedErrors);
  }
  
  next();
};

module.exports = {
  validateRequest
};