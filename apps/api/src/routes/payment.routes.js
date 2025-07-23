const express = require('express');
const { body, param } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Validation rules
const addPaymentMethodValidation = [
  body('type').isIn(['mobile_money', 'bank_card', 'bank_transfer']),
  body('provider').isString(),
  body('accountNumber').isString(),
  body('accountName').isString().optional()
];

const processPaymentValidation = [
  body('transactionId').isString().optional(),
  body('amount').isFloat({ min: 0 }),
  body('method').isString(),
  body('paymentMethodId').isString().optional()
];

// Routes pour les moyens de paiement
router.get('/methods', paymentController.getPaymentMethods);
router.post('/methods', addPaymentMethodValidation, validateRequest, paymentController.addPaymentMethod);
router.delete('/methods/:id', [param('id').isString()], validateRequest, paymentController.deletePaymentMethod);

// Routes pour les paiements
router.get('/history', paymentController.getPaymentHistory);
router.post('/process', processPaymentValidation, validateRequest, paymentController.processPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;