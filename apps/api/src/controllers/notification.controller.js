const notificationService = require('../services/notification.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Contrôleur pour la gestion des notifications
 */
class NotificationController {
  /**
   * Obtenir les notifications de l'utilisateur
   */
  async getNotifications(req, res, next) {
    try {
      const { notifications, total } = await notificationService.getNotifications(req.user.id, req.query);
      
      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        total
      };
      
      return paginatedResponse(res, notifications, pagination, 'Notifications récupérées avec succès');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount(req.user.id);
      return successResponse(res, { count }, 'Nombre de notifications non lues récupéré');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user.id);
      return successResponse(res, notification, 'Notification marquée comme lue');
    } catch (error) {
      if (error.message.includes('non trouvée')) {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('pas autorisé')) {
        return errorResponse(res, error.message, 403);
      }
      next(error);
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      return successResponse(res, result, 'Toutes les notifications marquées comme lues');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(req, res, next) {
    try {
      await notificationService.deleteNotification(req.params.id, req.user.id);
      return successResponse(res, null, 'Notification supprimée avec succès');
    } catch (error) {
      if (error.message.includes('non trouvée')) {
        return errorResponse(res, error.message, 404);
      }
      if (error.message.includes('pas autorisé')) {
        return errorResponse(res, error.message, 403);
      }
      next(error);
    }
  }
}

module.exports = new NotificationController();