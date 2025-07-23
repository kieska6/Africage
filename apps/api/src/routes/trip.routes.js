const express = require('express');
const { body, param, query } = require('express-validator');
const tripController = require('../controllers/trip.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateToken, requireRole, requireVerifiedUser } = require('../middleware/auth.middleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Validation rules
const createTripValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }),
  body('description').trim().isLength({ max: 500 }).optional(),
  body('departureCity').trim().isLength({ min: 2 }),
  body('departureCountry').trim().isLength({ min: 2 }),
  body('arrivalCity').trim().isLength({ min: 2 }),
  body('arrivalCountry').trim().isLength({ min: 2 }),
  body('departureDate').isISO8601(),
  body('arrivalDate').isISO8601(),
  body('availableWeight').isFloat({ min: 0.1, max: 1000 }),
  body('availableVolume').isFloat({ min: 0 }).optional(),
  body('maxPackages').isInt({ min: 1 }).optional(),
  body('pricePerKg').isFloat({ min: 0 }).optional(),
  body('minimumPrice').isFloat({ min: 0 }).optional()
];

const updateTripValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).optional(),
  body('description').trim().isLength({ max: 500 }).optional(),
  body('availableWeight').isFloat({ min: 0.1, max: 1000 }).optional(),
  body('pricePerKg').isFloat({ min: 0 }).optional(),
  body('status').isIn(['AVAILABLE', 'CANCELED']).optional()
];

// Routes CRUD
router.post('/', requireRole(['TRAVELER', 'BOTH']), requireVerifiedUser, createTripValidation, validateRequest, tripController.createTrip);
router.get('/', tripController.getTrips);
router.get('/my-trips', requireRole(['TRAVELER', 'BOTH']), tripController.getMyTrips);
router.get('/:id', [param('id').isString()], validateRequest, tripController.getTripById);
router.patch('/:id', [param('id').isString()], updateTripValidation, validateRequest, tripController.updateTrip);
router.delete('/:id', [param('id').isString()], validateRequest, tripController.deleteTrip);

// Routes spéciales
router.get('/search/compatible', tripController.searchCompatibleTrips);
router.get('/:id/available-capacity', [param('id').isString()], validateRequest, tripController.getAvailableCapacity);

module.exports = router;