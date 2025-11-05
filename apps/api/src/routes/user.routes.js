import { param } from 'express-validator';
import userController from '../controllers/user.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken, requireVerifiedUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/upload-avatar', userController.uploadAvatar);
router.post('/verify-phone', userController.verifyPhone);
router.post('/verify-identity', userController.verifyIdentity);
router.get('/stats', userController.getUserStats);

// Routes pour la recherche d'utilisateurs (admin ou fonctionnalités spéciales)
router.get('/', userController.getUsers);
router.get('/:id', [param('id').isString()], validateRequest, userController.getUserById);

export default router;