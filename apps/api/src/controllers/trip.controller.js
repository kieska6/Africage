import { PrismaClient } from '@prisma/client';

/**
 * Service pour la gestion des trajets
 */
class TripService {
  /**
   * Créer un nouveau trajet
   */
  async createTrip(userId, tripData) {
    const {
      title,
      description,
      departureCity,
      departureCountry,
      arrivalCity,
      arrivalCountry,
      departureDate,
      arrivalDate,
      availableWeight,
      availableVolume,
      maxPackages = 1,
      pricePerKg,
      minimumPrice,
      isRecurring = false,
      recurringPattern
    } = tripData;

    // Vérifier que la date d'arrivée est après la date de départ
    const depDate = new Date(departureDate);
    const arrDate = new Date(arrivalDate);
    
    if (arrDate <= depDate) {
      throw new Error('La date d\'arrivée doit être postérieure à la date de départ');
    }

    const trip = await prisma.trip.create({
      data: {
        travelerId: userId,
        title,
        description,
        departureCity,
        departureCountry,
        arrivalCity,
        arrivalCountry,
        departureDate: depDate,
        arrivalDate: arrDate,
        availableWeight,
        availableVolume,
        maxPackages,
        pricePerKg,
        minimumPrice,
        currency: 'XOF',
        status: 'AVAILABLE',
        isRecurring,
        recurringPattern
      }
    });

    return trip;
  }

  /**
   * Obtenir la liste des trajets
   */
  async getTrips(queryParams) {
    const {
      page = 1,
      limit = 10,
      search,
      departureCity,
      arrivalCity,
      status = 'AVAILABLE',
      minDate,
      maxDate,
      maxPricePerKg,
      minAvailableWeight
    } = queryParams;

    const skip = (page - 1) * limit;

    const where = { status };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (departureCity) {
      where.departureCity = { contains: departureCity, mode: 'insensitive' };
    }

    if (arrivalCity) {
      where.arrivalCity = { contains: arrivalCity, mode: 'insensitive' };
    }

    if (minDate || maxDate) {
      where.departureDate = {};
      if (minDate) where.departureDate.gte = new Date(minDate);
      if (maxDate) where.departureDate.lte = new Date(maxDate);
    }

    if (maxPricePerKg) {
      where.pricePerKg = { lte: parseFloat(maxPricePerKg) };
    }

    if (minAvailableWeight) {
      where.availableWeight = { gte: parseFloat(minAvailableWeight) };
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          traveler: {
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
            select: { id: true, status: true, shipment: { select: { weight: true } } }
          }
        },
        orderBy: { departureDate: 'asc' }
      }),
      prisma.trip.count({ where })
    ]);

    // Calculer la capacité restante pour chaque trajet
    const tripsWithCapacity = trips.map(trip => {
      const usedWeight = trip.transactions
        .filter(t => ['CONFIRMED', 'IN_PROGRESS'].includes(t.status))
        .reduce((sum, t) => sum + t.shipment.weight, 0);
      
      const remainingWeight = trip.availableWeight - usedWeight;
      const remainingPackages = trip.maxPackages - trip.transactions.filter(t => 
        ['CONFIRMED', 'IN_PROGRESS'].includes(t.status)
      ).length;

      return {
        ...trip,
        remainingWeight,
        remainingPackages,
        usedWeight
      };
    });

    return { trips: tripsWithCapacity, total };
  }

  /**
   * Obtenir les trajets de l'utilisateur
   */
  async getMyTrips(userId, queryParams) {
    const { status } = queryParams;

    const where = { travelerId: userId };
    if (status) {
      where.status = status;
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        transactions: {
          include: {
            shipment: { select: { id: true, title: true, weight: true, proposedPrice: true } },
            sender: {
              select: { id: true, firstName: true, lastName: true, profilePicture: true }
            }
          }
        }
      },
      orderBy: { departureDate: 'desc' }
    });

    return trips;
  }

  /**
   * Obtenir un trajet par ID
   */
  async getTripById(tripId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        traveler: {
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
            shipment: true,
            sender: {
              select: { id: true, firstName: true, lastName: true, profilePicture: true }
            }
          }
        }
      }
    });

    if (!trip) {
      throw new Error('Trajet non trouvé');
    }

    return trip;
  }

  /**
   * Mettre à jour un trajet
   */
  async updateTrip(tripId, userId, updateData) {
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!existingTrip) {
      throw new Error('Trajet non trouvé');
    }

    if (existingTrip.travelerId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à modifier ce trajet');
    }

    // Vérifier si le trajet peut être modifié
    if (existingTrip.status === 'COMPLETED') {
      throw new Error('Ce trajet ne peut plus être modifié');
    }

    const allowedFields = [
      'title', 'description', 'availableWeight', 'availableVolume',
      'maxPackages', 'pricePerKg', 'minimumPrice', 'status'
    ];

    const dataToUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        dataToUpdate[key] = updateData[key];
      }
    });

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: dataToUpdate,
      include: {
        traveler: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      }
    });

    return updatedTrip;
  }

  /**
   * Supprimer un trajet
   */
  async deleteTrip(tripId, userId) {
    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        transactions: {
          where: {
            status: { in: ['CONFIRMED', 'IN_PROGRESS'] }
          }
        }
      }
    });

    if (!existingTrip) {
      throw new Error('Trajet non trouvé');
    }

    if (existingTrip.travelerId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce trajet');
    }

    if (existingTrip.transactions.length > 0) {
      throw new Error('Ce trajet ne peut pas être supprimé car il a des transactions actives');
    }

    await prisma.trip.delete({
      where: { id: tripId }
    });

    return { success: true };
  }

  /**
   * Rechercher des trajets compatibles avec un colis
   */
  async searchCompatibleTrips(searchParams) {
    const {
      pickupCity,
      deliveryCity,
      weight,
      pickupDateFrom,
      pickupDateTo,
      deliveryDateBy
    } = searchParams;

    const where = {
      status: 'AVAILABLE',
      departureCity: { contains: pickupCity, mode: 'insensitive' },
      arrivalCity: { contains: deliveryCity, mode: 'insensitive' },
      availableWeight: { gte: parseFloat(weight) }
    };

    // Filtrer par dates si spécifiées
    if (pickupDateFrom || pickupDateTo || deliveryDateBy) {
      where.AND = [];

      if (pickupDateFrom) {
        where.AND.push({
          departureDate: { gte: new Date(pickupDateFrom) }
        });
      }

      if (pickupDateTo) {
        where.AND.push({
          departureDate: { lte: new Date(pickupDateTo) }
        });
      }

      if (deliveryDateBy) {
        where.AND.push({
          arrivalDate: { lte: new Date(deliveryDateBy) }
        });
      }
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        traveler: {
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
          select: { 
            id: true, 
            status: true, 
            shipment: { select: { weight: true } } 
          }
        }
      },
      orderBy: { departureDate: 'asc' }
    });

    // Filtrer les trajets qui ont encore de la capacité disponible
    const availableTrips = trips.filter(trip => {
      const usedWeight = trip.transactions
        .filter(t => ['CONFIRMED', 'IN_PROGRESS'].includes(t.status))
        .reduce((sum, t) => sum + t.shipment.weight, 0);
      
      const remainingWeight = trip.availableWeight - usedWeight;
      const remainingPackages = trip.maxPackages - trip.transactions.filter(t => 
        ['CONFIRMED', 'IN_PROGRESS'].includes(t.status)
      ).length;

      return remainingWeight >= parseFloat(weight) && remainingPackages > 0;
    });

    return availableTrips;
  }

  /**
   * Calculer la capacité disponible d'un trajet
   */
  async getAvailableCapacity(tripId) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        transactions: {
          select: { 
            status: true, 
            shipment: { select: { weight: true } } 
          }
        }
      }
    });

    if (!trip) {
      throw new Error('Trajet non trouvé');
    }

    const activeTransactions = trip.transactions.filter(t => 
      ['CONFIRMED', 'IN_PROGRESS'].includes(t.status)
    );

    const usedWeight = activeTransactions.reduce((sum, t) => sum + t.shipment.weight, 0);
    const usedPackages = activeTransactions.length;

    // Calculer le volume utilisé si disponible
    let usedVolume = 0;
    if (trip.availableVolume) {
      usedVolume = activeTransactions.reduce((sum, t) => {
        const shipment = t.shipment;
        if (shipment.length && shipment.width && shipment.height) {
          return sum + (shipment.length * shipment.width * shipment.height / 1000); // Convertir cm³ en litres
        }
        return sum;
      }, 0);
    }

    return {
      totalWeight: trip.availableWeight,
      usedWeight,
      remainingWeight: trip.availableWeight - usedWeight,
      totalVolume: trip.availableVolume,
      usedVolume,
      remainingVolume: trip.availableVolume ? trip.availableVolume - usedVolume : null,
      totalPackages: trip.maxPackages,
      usedPackages,
      remainingPackages: trip.maxPackages - usedPackages
    };
  }
}

export default new TripService();