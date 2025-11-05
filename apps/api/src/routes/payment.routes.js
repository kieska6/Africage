import { body, param } from 'express-validator';
import paymentController from '../controllers/payment.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

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

export default router;