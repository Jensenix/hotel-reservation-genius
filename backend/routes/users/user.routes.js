import express from 'express';
const router = express.Router();
import userController from '#controllers/users/user.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js'; 

// Publicly accessible routes
router.get('/:id', authenticateToken, userController.getUserById); 
router.put('/:id', authenticateToken, userController.updateUser); 

// Admin Routes
router.post('/', authenticateToken, requireAdmin, userController.createUser);
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

export default router;