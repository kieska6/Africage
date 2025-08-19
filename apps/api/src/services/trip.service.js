const prisma = require('../utils/prisma');
const { createError } = require('../utils/error');
const { TripStatus } = require('@prisma/client');

/**
 * Service pour la gestion des trajets
 */
class TripService {
  /**
   * Créer un nouveau trajet
   */
  async createTrip(userId, tripData) {
    if (new Date(tripData.departureDate) >= new Date(tripData.arrivalDate)) {
      throw createError(400, 'Departure date must be before arrival date.');
    }

    const trip = await prisma.trip.create({
      data: {
        ...tripData,
        travelerId: userId,
      },
    });
    return trip;
  }

  /**
   * Obtenir la liste des trajets avec filtres
   */
  async getTrips(queryParams) {
    // Basic implementation without filters for now
    const trips = await prisma.trip.findMany({
      where: {
        status: TripStatus.AVAILABLE,
        departureDate: {
          gte: new Date(), // Only show future trips
        },
      },
      include: {
        traveler: {
          select: {
            id: true,
            firstName: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        departureDate: 'asc',
      },
    });
    return trips;
  }

  /**
   * Obtenir les trajets de l'utilisateur
   */
  async getMyTrips(userId, queryParams) {
    const trips = await prisma.trip.findMany({
      where: {
        travelerId: userId,
      },
      orderBy: {
        departureDate: 'desc',
      },
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
          },
        },
      },
    });

    if (!trip) {
      throw createError(404, 'Trip not found.');
    }
    return trip;
  }

  /**
   * Mettre à jour un trajet
   */
  async updateTrip(tripId, userId, updateData) {
    const trip = await this.getTripById(tripId);

    if (trip.travelerId !== userId) {
      throw createError(403, 'You are not authorized to update this trip.');
    }
    
    if (trip.status !== TripStatus.AVAILABLE) {
        throw createError(400, `Cannot update a trip with status '${trip.status}'.`);
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
    });
    return updatedTrip;
  }

  /**
   * Supprimer un trajet
   */
  async deleteTrip(tripId, userId) {
    const trip = await this.getTripById(tripId);

    if (trip.travelerId !== userId) {
      throw createError(403, 'You are not authorized to delete this trip.');
    }
    
    if (trip.status !== TripStatus.AVAILABLE) {
        throw createError(400, `Cannot delete a trip with status '${trip.status}'.`);
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return { message: 'Trip deleted successfully.' };
  }

  // Other methods remain unimplemented for now...
}

module.exports = new TripService();