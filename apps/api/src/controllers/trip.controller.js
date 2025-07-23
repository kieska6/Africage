const tripService = require('../services/trip.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Contrôleur pour la gestion des trajets
 */
class TripController {
  /**
   * Créer un nouveau trajet
   */
  async createTrip(req, res, next) {
    try {
      // TODO: Create new trip
      // - Validate user role (TRAVELER or BOTH)
      // - Validate dates (departure < arrival)
      // - Create trip in database
      
      const trip = await tripService.createTrip(req.user.id, req.body);
      return successResponse(res, trip, 'Trip created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir la liste des trajets
   */
  async getTrips(req, res, next) {
    try {
      // TODO: Get paginated list of trips
      // - Apply filters (cities, dates, available capacity)
      // - Apply search
      // - Return paginated results
      
      const { trips, total } = await tripService.getTrips(req.query);
      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total
      };
      
      return paginatedResponse(res, trips, pagination, 'Trips retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les trajets de l'utilisateur connecté
   */
  async getMyTrips(req, res, next) {
    try {
      // TODO: Get user's trips
      
      const trips = await tripService.getMyTrips(req.user.id, req.query);
      return successResponse(res, trips, 'My trips retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir un trajet par ID
   */
  async getTripById(req, res, next) {
    try {
      // TODO: Get trip by ID with full details
      
      const trip = await tripService.getTripById(req.params.id);
      return successResponse(res, trip, 'Trip retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour un trajet
   */
  async updateTrip(req, res, next) {
    try {
      // TODO: Update trip
      // - Verify ownership
      // - Validate status transitions
      // - Update trip data
      
      const trip = await tripService.updateTrip(req.params.id, req.user.id, req.body);
      return successResponse(res, trip, 'Trip updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer un trajet
   */
  async deleteTrip(req, res, next) {
    try {
      // TODO: Delete trip
      // - Verify ownership
      // - Check if can be deleted (no active transactions)
      
      await tripService.deleteTrip(req.params.id, req.user.id);
      return successResponse(res, null, 'Trip deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rechercher des trajets compatibles avec un colis
   */
  async searchCompatibleTrips(req, res, next) {
    try {
      // TODO: Search trips compatible with a shipment
      // - Match cities and countries
      // - Check dates compatibility
      // - Check available capacity
      
      const trips = await tripService.searchCompatibleTrips(req.query);
      return successResponse(res, trips, 'Compatible trips found');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir la capacité disponible d'un trajet
   */
  async getAvailableCapacity(req, res, next) {
    try {
      // TODO: Calculate available capacity
      // - Get trip details
      // - Calculate used capacity from active transactions
      // - Return remaining capacity
      
      const capacity = await tripService.getAvailableCapacity(req.params.id);
      return successResponse(res, capacity, 'Available capacity calculated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TripController();