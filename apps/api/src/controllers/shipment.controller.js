const shipmentService = require('../services/shipment.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Contrôleur pour la gestion des colis
 */
class ShipmentController {
  /**
   * Créer une nouvelle annonce de colis
   */
  async createShipment(req, res, next) {
    try {
      // TODO: Create new shipment
      // - Validate user role (SENDER or BOTH)
      // - Create shipment in database
      // - Send notifications to potential travelers
      
      const shipment = await shipmentService.createShipment(req.user.id, req.body);
      return successResponse(res, shipment, 'Shipment created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir la liste des colis
   */
  async getShipments(req, res, next) {
    try {
      // TODO: Get paginated list of shipments
      // - Apply filters (city, country, status, etc.)
      // - Apply search
      // - Return paginated results
      
      const shipments = await shipmentService.getShipments(req.query);
      return successResponse(res, shipments, 'Shipments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les colis de l'utilisateur connecté
   */
  async getMyShipments(req, res, next) {
    try {
      // TODO: Get user's shipments
      
      const shipments = await shipmentService.getMyShipments(req.user.id, req.query);
      return successResponse(res, shipments, 'My shipments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir un colis par ID
   */
  async getShipmentById(req, res, next) {
    try {
      // TODO: Get shipment by ID with full details
      
      const shipment = await shipmentService.getShipmentById(req.params.id);
      return successResponse(res, shipment, 'Shipment retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour un colis
   */
  async updateShipment(req, res, next) {
    try {
      // TODO: Update shipment
      // - Verify ownership
      // - Validate status transitions
      // - Update shipment data
      
      const shipment = await shipmentService.updateShipment(req.params.id, req.user.id, req.body);
      return successResponse(res, shipment, 'Shipment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer un colis
   */
  async deleteShipment(req, res, next) {
    try {
      // TODO: Delete shipment
      // - Verify ownership
      // - Check if can be deleted (no active transactions)
      
      await shipmentService.deleteShipment(req.params.id, req.user.id);
      return successResponse(res, null, 'Shipment deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rechercher des colis compatibles avec un trajet
   */
  async searchCompatibleShipments(req, res, next) {
    try {
      // TODO: Search shipments compatible with a trip
      // - Match cities and countries
      // - Check dates compatibility
      // - Check weight/volume constraints
      
      const shipments = await shipmentService.searchCompatibleShipments(req.query);
      return successResponse(res, shipments, 'Compatible shipments found');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload de photos pour un colis
   */
  async uploadPhotos(req, res, next) {
    try {
      // TODO: Handle multiple file uploads
      // - Validate file types and sizes
      // - Upload to cloud storage
      // - Update shipment photos array
      
      const result = await shipmentService.uploadPhotos(req.params.id, req.user.id, req.files);
      return successResponse(res, result, 'Photos uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShipmentController();