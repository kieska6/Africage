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
      // TODO: Implement user registration logic
      // - Hash password
      // - Create user in database
      // - Generate JWT token
      // - Send welcome email
      
      const result = await authService.register(req.body);
      return successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Connexion utilisateur
   */
  async login(req, res, next) {
    try {
      // TODO: Implement user login logic
      // - Validate credentials
      // - Generate JWT token
      // - Update lastLoginAt
      
      const result = await authService.login(req.body);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(req, res, next) {
    try {
      // TODO: Implement logout logic
      // - Invalidate token (blacklist or remove from session)
      
      await authService.logout(req.user.id);
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mot de passe oublié
   */
  async forgotPassword(req, res, next) {
    try {
      // TODO: Implement forgot password logic
      // - Generate reset token
      // - Send reset email
      
      await authService.forgotPassword(req.body.email);
      return successResponse(res, null, 'Password reset email sent');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(req, res, next) {
    try {
      // TODO: Implement password reset logic
      // - Validate reset token
      // - Hash new password
      // - Update user password
      
      await authService.resetPassword(req.body);
      return successResponse(res, null, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken(req, res, next) {
    try {
      // TODO: Implement token refresh logic
      
      const result = await authService.refreshToken(req.user.id);
      return successResponse(res, result, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  async getCurrentUser(req, res, next) {
    try {
      // TODO: Return current user data (without sensitive info)
      
      const user = await authService.getCurrentUser(req.user.id);
      return successResponse(res, user, 'User data retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();