const express = require('express');
const { param } = require('express-validator');
const notificationController = require('../controllers/notification.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', [param('id').isString()], validateRequest, notificationController.markAsRead);
router.patch('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', [param('id').isString()], validateRequest, notificationController.deleteNotification);

module.exports = router;