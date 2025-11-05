import { PrismaClient } from '@prisma/client';

/**
 * Service pour la gestion des colis
 */
class ShipmentService {
  /**
   * Créer une nouvelle annonce de colis
   */
  async createShipment(userId, shipmentData) {
    const {
      title,
      description,
      weight,
      length,
      width,
      height,
      pickupAddress,
      pickupCity,
      pickupCountry,
      deliveryAddress,
      deliveryCity,
      deliveryCountry,
      proposedPrice,
      currency,
      pickupDateFrom,
      pickupDateTo,
      deliveryDateBy,
      isUrgent = false,
      isFragile = false,
      requiresSignature = false
    } = shipmentData;

    const shipment = await prisma.shipment.create({
      data: {
        senderId: userId,
        title,
        description,
        weight,
        length,
        width,
        height,
        pickupAddress,
        pickupCity,
        pickupCountry,
        deliveryAddress,
        deliveryCity,
        deliveryCountry,
        proposedPrice,
        currency,
        pickupDateFrom: pickupDateFrom ? new Date(pickupDateFrom) : null,
        pickupDateTo: pickupDateTo ? new Date(pickupDateTo) : null,
        deliveryDateBy: deliveryDateBy ? new Date(deliveryDateBy) : null,
        isUrgent,
        isFragile,
        requiresSignature,
        status: 'PENDING_MATCH'
      }
    });

    // TODO: Envoyer des notifications aux voyageurs potentiels
    
    return shipment;
  }

  /**
   * Obtenir la liste des colis
   */
  async getShipments(queryParams) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      pickupCity, 
      deliveryCity, 
      status = 'PENDING_MATCH',
      minPrice,
      maxPrice,
      maxWeight
    } = queryParams;
    
    const skip = (page - 1) * limit;

    const where = { status };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (pickupCity) {
      where.pickupCity = { contains: pickupCity, mode: 'insensitive' };
    }

    if (deliveryCity) {
      where.deliveryCity = { contains: deliveryCity, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.proposedPrice = {};
      if (minPrice) where.proposedPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.proposedPrice.lte = parseFloat(maxPrice);
    }

    if (maxWeight) {
      where.weight = { lte: parseFloat(maxWeight) };
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePicture: true,
              city: true,
              country: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.shipment.count({ where })
    ]);

    return { shipments, total };
  }

  /**
   * Obtenir les colis de l'utilisateur
   */
  async getMyShipments(userId, queryParams) {
    const { status } = queryParams;

    const where = { senderId: userId };
    if (status) {
      where.status = status;
    }

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        transactions: {
          include: {
            trip: {
              select: { id: true, title: true, departureDate: true, arrivalDate: true }
            },
            traveler: {
              select: { id: true, firstName: true, lastName: true, profilePicture: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
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
            city: true,
            country: true,
            receivedReviews: {
              select: { rating: true }
            }
          }
        },
        transactions: {
          include: {
            trip: true,
            traveler: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true
              }
            }
          }
        }
      }
    });

    if (!shipment) {
      throw new Error('Colis non trouvé');
    }

    return shipment;
  }

  /**
   * Mettre à jour un colis
   */
  async updateShipment(shipmentId, userId, updateData) {
    // Vérifier que l'utilisateur est propriétaire du colis
    const existingShipment = await prisma.shipment.findUnique({
      where: { id: shipmentId }
    });

    if (!existingShipment) {
      throw new Error('Colis non trouvé');
    }

    if (existingShipment.senderId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à modifier ce colis');
    }

    // Vérifier si le colis peut être modifié
    if (existingShipment.status === 'IN_TRANSIT' || existingShipment.status === 'DELIVERED') {
      throw new Error('Ce colis ne peut plus être modifié');
    }

    const allowedFields = [
      'title', 'description', 'proposedPrice', 'pickupDateFrom', 
      'pickupDateTo', 'deliveryDateBy', 'status'
    ];

    const dataToUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key.includes('Date') && updateData[key]) {
          dataToUpdate[key] = new Date(updateData[key]);
        } else {
          dataToUpdate[key] = updateData[key];
        }
      }
    });

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: dataToUpdate,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      }
    });

    return updatedShipment;
  }

  /**
   * Supprimer un colis
   */
  async deleteShipment(shipmentId, userId) {
    const existingShipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        transactions: {
          where: {
            status: { in: ['CONFIRMED', 'IN_PROGRESS'] }
          }
        }
      }
    });

    if (!existingShipment) {
      throw new Error('Colis non trouvé');
    }

    if (existingShipment.senderId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce colis');
    }

    if (existingShipment.transactions.length > 0) {
      throw new Error('Ce colis ne peut pas être supprimé car il a des transactions actives');
    }

    await prisma.shipment.delete({
      where: { id: shipmentId }
    });

    return { success: true };
  }

  /**
   * Rechercher des colis compatibles avec un trajet
   */
  async searchCompatibleShipments(searchParams) {
    const {
      departureCity,
      arrivalCity,
      departureDate,
      arrivalDate,
      availableWeight
    } = searchParams;

    const where = {
      status: 'PENDING_MATCH',
      pickupCity: { contains: departureCity, mode: 'insensitive' },
      deliveryCity: { contains: arrivalCity, mode: 'insensitive' }
    };

    // Filtrer par dates si spécifiées
    if (departureDate && arrivalDate) {
      const depDate = new Date(departureDate);
      const arrDate = new Date(arrivalDate);
      
      where.AND = [
        {
          OR: [
            { pickupDateFrom: null },
            { pickupDateFrom: { lte: depDate } }
          ]
        },
        {
          OR: [
            { deliveryDateBy: null },
            { deliveryDateBy: { gte: arrDate } }
          ]
        }
      ];
    }

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            city: true,
            country: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return shipments;
  }

  /**
   * Upload de photos pour un colis
   */
  async uploadPhotos(shipmentId, userId, files) {
    const existingShipment = await prisma.shipment.findUnique({
      where: { id: shipmentId }
    });

    if (!existingShipment) {
      throw new Error('Colis non trouvé');
    }

    if (existingShipment.senderId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à modifier ce colis');
    }

    // TODO: Implémenter l'upload réel vers cloud storage
    // Pour l'instant, on simule avec des URLs fictives
    const photoUrls = files.map((file, index) => 
      `https://example.com/shipments/${shipmentId}/photo-${index + 1}-${Date.now()}.jpg`
    );

    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: { 
        photos: [...existingShipment.photos, ...photoUrls]
      }
    });

    return { photos: updatedShipment.photos };
  }
}

export default new ShipmentService();