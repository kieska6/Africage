import { body, param, query } from 'express-validator';
import shipmentController from '../controllers/shipment.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken, requireRole, requireVerifiedUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Validation rules
const createShipmentValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }),
  body('description').trim().isLength({ max: 500 }).optional(),
  body('weight').isFloat({ min: 0.1, max: 1000 }),
  body('pickupAddress').trim().isLength({ min: 5 }),
  body('pickupCity').trim().isLength({ min: 2 }),
  body('pickupCountry').trim().isLength({ min: 2 }),
  body('deliveryAddress').trim().isLength({ min: 5 }),
  body('deliveryCity').trim().isLength({ min: 2 }),
  body('deliveryCountry').trim().isLength({ min: 2 }),
  body('proposedPrice').isFloat({ min: 0 }),
  body('pickupDateFrom').isISO8601().optional(),
  body('pickupDateTo').isISO8601().optional(),
  body('deliveryDateBy').isISO8601().optional()
];

const updateShipmentValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).optional(),
  body('description').trim().isLength({ max: 500 }).optional(),
  body('proposedPrice').isFloat({ min: 0 }).optional(),
  body('status').isIn(['PENDING_MATCH', 'CANCELED']).optional()
];

// Routes CRUD
router.post('/', requireRole(['SENDER', 'BOTH']), requireVerifiedUser, createShipmentValidation, validateRequest, shipmentController.createShipment);
router.get('/', shipmentController.getShipments);
router.get('/my-shipments', requireRole(['SENDER', 'BOTH']), shipmentController.getMyShipments);
router.get('/:id', [param('id').isString()], validateRequest, shipmentController.getShipmentById);
router.patch('/:id', [param('id').isString()], updateShipmentValidation, validateRequest, shipmentController.updateShipment);
router.delete('/:id', [param('id').isString()], validateRequest, shipmentController.deleteShipment);

// Routes spéciales
router.get('/search/compatible', shipmentController.searchCompatibleShipments);
router.post('/:id/photos', [param('id').isString()], validateRequest, shipmentController.uploadPhotos);

export default router;