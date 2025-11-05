import { param } from 'express-validator';
import notificationController from '../controllers/notification.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', [param('id').isString()], validateRequest, notificationController.markAsRead);
router.patch('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', [param('id').isString()], validateRequest, notificationController.deleteNotification);

export default router;