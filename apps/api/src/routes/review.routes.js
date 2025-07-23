const express = require('express');
const { body, param } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Validation rules
const createReviewValidation = [
  body('transactionId').isString(),
  body('revieweeId').isString(),
  body('type').isIn(['SENDER_TO_TRAVELER', 'TRAVELER_TO_SENDER']),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ max: 500 }).optional(),
  body('punctuality').isInt({ min: 1, max: 5 }).optional(),
  body('communication').isInt({ min: 1, max: 5 }).optional(),
  body('carefulness').isInt({ min: 1, max: 5 }).optional()
];

// Routes CRUD
router.post('/', createReviewValidation, validateRequest, reviewController.createReview);
router.get('/my-reviews', reviewController.getMyReviews);
router.get('/user/:userId', [param('userId').isString()], validateRequest, reviewController.getUserReviews);
router.get('/:id', [param('id').isString()], validateRequest, reviewController.getReviewById);

module.exports = router;