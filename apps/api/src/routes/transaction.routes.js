import { body, param } from 'express-validator';
import transactionController from '../controllers/transaction.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken, requireVerifiedUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Validation rules
const createTransactionValidation = [
  body('shipmentId').isString(),
  body('tripId').isString(),
  body('agreedPrice').isFloat({ min: 0 })
];

const updateStatusValidation = [
  body('status').isIn(['CONFIRMED', 'IN_PROGRESS', 'DELIVERED', 'CANCELED', 'DISPUTED'])
];

// Routes CRUD
router.post('/', requireVerifiedUser, createTransactionValidation, validateRequest, transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/my-transactions', transactionController.getMyTransactions);
router.get('/:id', [param('id').isString()], validateRequest, transactionController.getTransactionById);

// Routes de gestion du statut
router.patch('/:id/status', [param('id').isString()], updateStatusValidation, validateRequest, transactionController.updateTransactionStatus);
router.post('/:id/confirm', [param('id').isString()], validateRequest, transactionController.confirmTransaction);
router.post('/:id/pickup', [param('id').isString()], validateRequest, transactionController.confirmPickup);
router.post('/:id/delivery', [param('id').isString(), body('securityCode').isString()], validateRequest, transactionController.confirmDelivery);

// Routes de gestion des litiges
router.post('/:id/dispute', [param('id').isString(), body('reason').isString()], validateRequest, transactionController.createDispute);

export default router;