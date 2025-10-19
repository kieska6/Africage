const prisma = require('../utils/prisma');
const { NOTIFICATION_TYPES } = require('../utils/constants');

/**
 * Service pour la gestion des notifications
 */
class NotificationService {
  /**
   * Créer une nouvelle notification
   */
  async createNotification(notificationData) {
    const {
      userId,
      transactionId,
      type,
      title,
      message,
      data = {}
    } = notificationData;

    const notification = await prisma.notification.create({
      data: {
        userId,
        transactionId,
        type,
        title,
        message,
        data
      }
    });

    // TODO: Envoyer une notification push ou email si configuré

    return notification;
  }

  /**
   * Obtenir les notifications de l'utilisateur
   */
  async getNotifications(userId, queryParams) {
    const { page = 1, limit = 20, isRead } = queryParams;
    const skip = (page - 1) * limit;

    const where = { userId };
    
    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          transaction: {
            select: {
              id: true,
              status: true,
              shipment: {
                select: { id: true, title: true }
              },
              trip: {
                select: { id: true, title: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where })
    ]);

    return { notifications, total };
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadCount(userId) {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    return count;
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      throw new Error('Notification non trouvée');
    }

    if (notification.userId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à modifier cette notification');
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return updatedNotification;
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(userId) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return { updatedCount: result.count };
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      throw new Error('Notification non trouvée');
    }

    if (notification.userId !== userId) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer cette notification');
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return { success: true };
  }

  /**
   * Créer des notifications pour les événements de transaction
   */
  async createTransactionNotifications(transactionId, eventType, additionalData = {}) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        shipment: { select: { id: true, title: true } },
        trip: { select: { id: true, title: true } },
        sender: { select: { id: true, firstName: true, lastName: true } },
        traveler: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    if (!transaction) {
      throw new Error('Transaction non trouvée');
    }

    const notifications = [];

    switch (eventType) {
      case 'TRANSACTION_CREATED':
        // Notifier le voyageur qu'une nouvelle demande a été créée
        notifications.push({
          userId: transaction.travelerId,
          transactionId,
          type: 'TRIP_BOOKED',
          title: 'Nouvelle demande de transport',
          message: `${transaction.sender.firstName} ${transaction.sender.lastName} souhaite transporter "${transaction.shipment.title}"`,
          data: { transactionId, shipmentId: transaction.shipmentId }
        });
        break;

      case 'TRANSACTION_CONFIRMED':
        // Notifier l'expéditeur que sa demande a été acceptée
        notifications.push({
          userId: transaction.senderId,
          transactionId,
          type: 'SHIPMENT_MATCHED',
          title: 'Demande acceptée !',
          message: `${transaction.traveler.firstName} ${transaction.traveler.lastName} a accepté de transporter votre colis`,
          data: { transactionId, tripId: transaction.tripId }
        });
        break;

      case 'PICKUP_CONFIRMED':
        // Notifier l'expéditeur que le colis a été récupéré
        notifications.push({
          userId: transaction.senderId,
          transactionId,
          type: 'SYSTEM_ALERT',
          title: 'Colis récupéré',
          message: `Votre colis "${transaction.shipment.title}" a été récupéré par ${transaction.traveler.firstName}`,
          data: { transactionId }
        });
        break;

      case 'DELIVERY_CONFIRMED':
        // Notifier les deux parties que la livraison est confirmée
        notifications.push(
          {
            userId: transaction.senderId,
            transactionId,
            type: 'DELIVERY_CONFIRMED',
            title: 'Livraison confirmée !',
            message: `Votre colis "${transaction.shipment.title}" a été livré avec succès`,
            data: { transactionId }
          },
          {
            userId: transaction.travelerId,
            transactionId,
            type: 'PAYMENT_RECEIVED',
            title: 'Paiement reçu',
            message: `Vous avez reçu le paiement pour le transport de "${transaction.shipment.title}"`,
            data: { transactionId, amount: transaction.agreedPrice }
          }
        );
        break;

      case 'DISPUTE_CREATED':
        // Notifier l'autre partie qu'un litige a été créé
        const otherUserId = additionalData.createdBy === transaction.senderId 
          ? transaction.travelerId 
          : transaction.senderId;
        
        notifications.push({
          userId: otherUserId,
          transactionId,
          type: 'SYSTEM_ALERT',
          title: 'Litige créé',
          message: `Un litige a été créé pour la transaction "${transaction.shipment.title}"`,
          data: { transactionId, reason: additionalData.reason }
        });
        break;
    }

    // Créer toutes les notifications
    for (const notificationData of notifications) {
      await this.createNotification(notificationData);
    }

    return notifications;
  }

  /**
   * Supprimer les anciennes notifications
   */
  async cleanupOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true
      }
    });

    return { deletedCount: result.count };
  }
}

module.exports = new NotificationService();