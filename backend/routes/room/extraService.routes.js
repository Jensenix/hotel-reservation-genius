import express from 'express';
const router = express.Router();
import extraServiceController from '#controllers/room/extraService.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

// Extra Service Routes 
router.get('/', extraServiceController.getAllExtraServices);
router.get('/:id', extraServiceController.getExtraServiceById);

// Admin Routes, used for creating, updating, and deleting extra services
router.post('/', authenticateToken, requireAdmin, extraServiceController.createExtraService);
router.put('/:id', authenticateToken, requireAdmin, extraServiceController.updateExtraService);
router.delete('/:id', authenticateToken, requireAdmin, extraServiceController.deleteExtraService);

export default router;