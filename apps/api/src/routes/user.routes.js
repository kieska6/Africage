const express = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/user.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateToken, requireVerifiedUser } = require('../middleware/auth.middleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Validation rules
const updateProfileValidation = [
  body('firstName').trim().isLength({ min: 2 }).optional(),
  body('lastName').trim().isLength({ min: 2 }).optional(),
  body('phone').isMobilePhone().optional(),
  body('city').trim().isLength({ min: 2 }).optional(),
  body('country').trim().isLength({ min: 2 }).optional()
];

// Routes
router.get('/profile', userController.getProfile);
router.patch('/profile', updateProfileValidation, validateRequest, userController.updateProfile);
router.post('/upload-avatar', userController.uploadAvatar);
router.post('/verify-phone', userController.verifyPhone);
router.post('/verify-identity', userController.verifyIdentity);
router.get('/stats', userController.getUserStats);

// Routes pour la recherche d'utilisateurs (admin ou fonctionnalités spéciales)
router.get('/', userController.getUsers);
router.get('/:id', [param('id').isString()], validateRequest, userController.getUserById);

module.exports = router;