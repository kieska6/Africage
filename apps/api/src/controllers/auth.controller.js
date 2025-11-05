const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Contrôleur pour l'authentification
 */
class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, result, 'Utilisateur créé avec succès', 201);
    } catch (error) {
      if (error.message.includes('existe déjà')) {
        return errorResponse(res, error.message, 409);
      }
      next(error);
    }
  }

  /**
   * Connexion utilisateur
   */
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return successResponse(res, result, 'Connexion réussie');
    } catch (error) {
      if (error.message.includes('incorrect')) {
        return errorResponse(res, error.message, 401);
      }
      next(error);
    }
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(req, res, next) {
    try {
      await authService.logout(req.user.id);
      return successResponse(res, null, 'Déconnexion réussie');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mot de passe oublié
   */
  async forgotPassword(req, res, next) {
    try {
      await authService.forgotPassword(req.body.email);
      return successResponse(res, null, 'Email de réinitialisation envoyé');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(req, res, next) {
    try {
      await authService.resetPassword(req.body);
      return successResponse(res, null, 'Mot de passe réinitialisé avec succès');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken(req, res, next) {
    try {
      const result = await authService.refreshToken(req.user.id);
      return successResponse(res, result, 'Token rafraîchi');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return successResponse(res, user, 'Données utilisateur récupérées');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();