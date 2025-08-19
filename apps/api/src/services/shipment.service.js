const prisma = require('../utils/prisma');
const { createError } = require('../utils/error');
const { ShipmentStatus } = require('@prisma/client');

/**
 * Service pour la gestion des colis
 */
class ShipmentService {
  /**
   * Créer une nouvelle annonce de colis
   */
  async createShipment(userId, shipmentData) {
    const shipment = await prisma.shipment.create({
      data: {
        ...shipmentData,
        senderId: userId,
      },
    });
    return shipment;
  }

  /**
   * Obtenir la liste des colis avec filtres
   */
  async getShipments(queryParams) {
    // Basic implementation without filters for now
    const shipments = await prisma.shipment.findMany({
      where: {
        status: ShipmentStatus.PENDING_MATCH, // Only show available shipments
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return shipments;
  }

  /**
   * Obtenir les colis de l'utilisateur
   */
  async getMyShipments(userId, queryParams) {
    const shipments = await prisma.shipment.findMany({
      where: {
        senderId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return shipments;
  }

  /**
   * Obtenir un colis par ID
   */
  async getShipmentById(shipmentId) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!shipment) {
      throw createError(404, 'Shipment not found.');
    }
    return shipment;
  }

  /**
   * Mettre à jour un colis
   */
  async updateShipment(shipmentId, userId, updateData) {
    const shipment = await this.getShipmentById(shipmentId);

    if (shipment.senderId !== userId) {
      throw createError(403, 'You are not authorized to update this shipment.');
    }
    
    if (shipment.status !== ShipmentStatus.PENDING_MATCH) {
        throw createError(400, `Cannot update a shipment with status '${shipment.status}'.`);
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: updateData,
    });
    return updatedShipment;
  }

  /**
   * Supprimer un colis
   */
  async deleteShipment(shipmentId, userId) {
    const shipment = await this.getShipmentById(shipmentId);

    if (shipment.senderId !== userId) {
      throw createError(403, 'You are not authorized to delete this shipment.');
    }
    
    if (shipment.status !== ShipmentStatus.PENDING_MATCH) {
        throw createError(400, `Cannot delete a shipment with status '${shipment.status}'.`);
    }

    await prisma.shipment.delete({
      where: { id: shipmentId },
    });

    return { message: 'Shipment deleted successfully.' };
  }

  // Other methods remain unimplemented for now...
}

module.exports = new ShipmentService();