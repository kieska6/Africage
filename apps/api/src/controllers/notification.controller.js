const notificationService = require('../services/notification.service');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Contrôleur pour la gestion des notifications
 */
class NotificationController {
  /**
   * Obtenir les notifications de l'utilisateur
   */
  async getNotifications(req, res, next) {
    try {
      // TODO: Get user notifications
      // - Apply pagination
      // - Order by creation date (newest first)
      
      const notifications = await notificationService.getNotifications(req.user.id, req.query);
      return successResponse(res, notifications, 'Notifications retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadCount(req, res, next) {
    try {
      // TODO: Count unread notifications
      
      const count = await notificationService.getUnreadCount(req.user.id);
      return successResponse(res, { count }, 'Unread count retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(req, res, next) {
    try {
      // TODO: Mark notification as read
      // - Verify ownership
      // - Update isRead and readAt
      
      const notification = await notificationService.markAsRead(req.params.id, req.user.id);
      return successResponse(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(req, res, next) {
    try {
      // TODO: Mark all user notifications as read
      
      const result = await notificationService.markAllAsRead(req.user.id);
      return successResponse(res, result, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(req, res, next) {
    try {
      // TODO: Delete notification
      // - Verify ownership
      
      await notificationService.deleteNotification(req.params.id, req.user.id);
      return successResponse(res, null, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();