import express from 'express';
const router = express.Router();
import extraServiceController from '#controllers/room/extraService.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

router.get('/', extraServiceController.getAllExtraServices);
router.get('/:id', extraServiceController.getExtraServiceById);
router.post('/', authenticateToken, requireAdmin, extraServiceController.createExtraService);
router.put('/:id', authenticateToken, requireAdmin, extraServiceController.updateExtraService);
router.delete('/:id', authenticateToken, requireAdmin, extraServiceController.deleteExtraService);

export default router;