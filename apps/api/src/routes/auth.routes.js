const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('role').isIn(['SENDER', 'TRAVELER', 'BOTH']).optional()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Routes publiques
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/forgot-password', [body('email').isEmail()], validateRequest, authController.forgotPassword);
router.post('/reset-password', [body('token').notEmpty(), body('password').isLength({ min: 6 })], validateRequest, authController.resetPassword);

// Routes protégées
router.post('/logout', authenticateToken, authController.logout);
router.post('/refresh-token', authenticateToken, authController.refreshToken);
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;