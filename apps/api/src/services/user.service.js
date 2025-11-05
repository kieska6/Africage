const prisma = require('../utils/prisma');

/**
 * Service pour la gestion des utilisateurs
 */
class UserService {
  /**
   * Obtenir le profil complet d'un utilisateur
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profilePicture: true,
        dateOfBirth: true,
        role: true,
        status: true,
        isPhoneVerified: true,
        isEmailVerified: true,
        isIdentityVerified: true,
        identityDocument: true,
        city: true,
        country: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true
      }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userId, updateData) {
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'dateOfBirth', 
      'city', 'country', 'address'
    ];

    const dataToUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        dataToUpdate[key] = updateData[key];
      }
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profilePicture: true,
        dateOfBirth: true,
        role: true,
        status: true,
        city: true,
        country: true,
        address: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  /**
   * Upload d'avatar
   */
  async uploadAvatar(userId, file) {
    // TODO: Implémenter l'upload vers un service cloud (Cloudinary/S3)
    // Pour l'instant, on simule avec une URL fictive
    const avatarUrl = `https://example.com/avatars/${userId}-${Date.now()}.jpg`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: avatarUrl },
      select: {
        id: true,
        profilePicture: true
      }
    });

    return { profilePicture: updatedUser.profilePicture };
  }

  /**
   * Vérification du numéro de téléphone
   */
  async verifyPhone(userId, verificationData) {
    const { phone, verificationCode } = verificationData;

    // TODO: Implémenter la vérification SMS réelle
    // Pour l'instant, on accepte le code "123456"
    if (verificationCode !== '123456') {
      throw new Error('Code de vérification incorrect');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        phone,
        isPhoneVerified: true 
      },
      select: {
        id: true,
        phone: true,
        isPhoneVerified: true
      }
    });

    return updatedUser;
  }

  /**
   * Vérification d'identité (KYC)
   */
  async verifyIdentity(userId, identityData) {
    const { documentType, documentUrl } = identityData;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        identityDocument: documentUrl,
        // Pour l'instant, on marque automatiquement comme vérifié
        isIdentityVerified: true,
        status: 'VERIFIED'
      },
      select: {
        id: true,
        isIdentityVerified: true,
        status: true
      }
    });

    return updatedUser;
  }

  /**
   * Obtenir les statistiques de l'utilisateur
   */
  async getUserStats(userId) {
    const [
      shipmentsCount,
      tripsCount,
      completedTransactions,
      averageRating
    ] = await Promise.all([
      prisma.shipment.count({
        where: { senderId: userId }
      }),
      prisma.trip.count({
        where: { travelerId: userId }
      }),
      prisma.transaction.count({
        where: {
          OR: [
            { senderId: userId },
            { travelerId: userId }
          ],
          status: 'COMPLETED'
        }
      }),
      prisma.review.aggregate({
        where: { revieweeId: userId },
        _avg: { rating: true }
      })
    ]);

    return {
      shipmentsCount,
      tripsCount,
      completedTransactions,
      averageRating: averageRating._avg.rating || 0,
      totalEarnings: 0 // TODO: Calculer les gains réels
    };
  }

  /**
   * Obtenir la liste des utilisateurs (admin)
   */
  async getUsers(queryParams) {
    const { page = 1, limit = 10, search, role, status } = queryParams;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          city: true,
          country: true,
          createdAt: true,
          lastLoginAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return { users, total };
  }

  /**
   * Obtenir un utilisateur par ID (profil public)
   */
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        city: true,
        country: true,
        role: true,
        status: true,
        createdAt: true,
        // Inclure les statistiques publiques
        sentShipments: {
          select: { id: true },
          where: { status: { not: 'CANCELED' } }
        },
        trips: {
          select: { id: true },
          where: { status: { not: 'CANCELED' } }
        },
        receivedReviews: {
          select: { rating: true }
        }
      }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Calculer les statistiques publiques
    const averageRating = user.receivedReviews.length > 0
      ? user.receivedReviews.reduce((sum, review) => sum + review.rating, 0) / user.receivedReviews.length
      : 0;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      city: user.city,
      country: user.country,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      stats: {
        shipmentsCount: user.sentShipments.length,
        tripsCount: user.trips.length,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewsCount: user.receivedReviews.length
      }
    };
  }
}

module.exports = new UserService();