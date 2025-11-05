const userService = require('../services/user.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Contrôleur pour la gestion des utilisateurs
 */
class UserController {
  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  async getProfile(req, res, next) {
    try {
      // TODO: Get user profile with all details
      
      const profile = await userService.getProfile(req.user.id);
      return successResponse(res, profile, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(req, res, next) {
    try {
      // TODO: Update user profile
      // - Validate data
      // - Update user in database
      
      const updatedProfile = await userService.updateProfile(req.user.id, req.body);
      return successResponse(res, updatedProfile, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload d'avatar
   */
  async uploadAvatar(req, res, next) {
    try {
      // TODO: Handle file upload
      // - Validate file type and size
      // - Upload to cloud storage (Cloudinary/S3)
      // - Update user profilePicture URL
      
      const result = await userService.uploadAvatar(req.user.id, req.file);
      return successResponse(res, result, 'Avatar uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Vérification du numéro de téléphone
   */
  async verifyPhone(req, res, next) {
    try {
      // TODO: Implement phone verification
      // - Send SMS with verification code
      // - Verify code and update isPhoneVerified
      
      const result = await userService.verifyPhone(req.user.id, req.body);
      return successResponse(res, result, 'Phone verification processed');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Vérification d'identité (KYC)
   */
  async verifyIdentity(req, res, next) {
    try {
      // TODO: Implement identity verification
      // - Upload identity document
      // - Process verification (manual or automated)
      
      const result = await userService.verifyIdentity(req.user.id, req.body);
      return successResponse(res, result, 'Identity verification submitted');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les statistiques de l'utilisateur
   */
  async getUserStats(req, res, next) {
    try {
      // TODO: Calculate user statistics
      // - Number of shipments sent
      // - Number of trips completed
      // - Average rating
      // - Total earnings
      
      const stats = await userService.getUserStats(req.user.id);
      return successResponse(res, stats, 'User statistics retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir la liste des utilisateurs (admin)
   */
  async getUsers(req, res, next) {
    try {
      // TODO: Get paginated list of users
      // - Apply filters and search
      // - Return paginated results
      
      const { users, total } = await userService.getUsers(req.query);
      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total
      };
      
      return paginatedResponse(res, users, pagination, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir un utilisateur par ID
   */
  async getUserById(req, res, next) {
    try {
      // TODO: Get user by ID (public profile)
      
      const user = await userService.getUserById(req.params.id);
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();