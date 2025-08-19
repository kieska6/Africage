/**
 * Crée un objet Erreur avec un code de statut.
 * @param {number} statusCode - Le code de statut HTTP de l'erreur.
 * @param {string} message - Le message d'erreur.
 * @returns {Error} - L'objet Erreur avec la propriété `statusCode`.
 */
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { createError };
