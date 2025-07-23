const reviewService = require('../services/review.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Contrôleur pour la gestion des évaluations
 */
class ReviewController {
  /**
   * Créer une nouvelle évaluation
   */
  async createReview(req, res, next) {
    try {
      // TODO: Create new review
      // - Verify transaction exists and is completed
      // - Verify user is involved in transaction
      // - Check if review already exists
      // - Create review
      // - Send notification to reviewee
      
      const review = await reviewService.createReview(req.user.id, req.body);
      return successResponse(res, review, 'Review created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les évaluations de l'utilisateur connecté
   */
  async getMyReviews(req, res, next) {
    try {
      // TODO: Get reviews for current user
      // - Get both sent and received reviews
      
      const reviews = await reviewService.getMyReviews(req.user.id, req.query);
      return successResponse(res, reviews, 'My reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les évaluations d'un utilisateur
   */
  async getUserReviews(req, res, next) {
    try {
      // TODO: Get reviews for a specific user (public)
      // - Get received reviews only
      // - Calculate average rating
      
      const reviews = await reviewService.getUserReviews(req.params.userId, req.query);
      return successResponse(res, reviews, 'User reviews retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir une évaluation par ID
   */
  async getReviewById(req, res, next) {
    try {
      // TODO: Get review by ID
      
      const review = await reviewService.getReviewById(req.params.id);
      return successResponse(res, review, 'Review retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();