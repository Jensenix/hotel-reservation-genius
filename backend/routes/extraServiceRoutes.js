import express from 'express';
const router = express.Router();
import extraServiceController from '../controllers/extraServiceController.js';

// CRUD Routes
router.post('/', extraServiceController.createExtraService);
router.get('/', extraServiceController.getAllExtraServices);
router.get('/:id', extraServiceController.getExtraServiceById);
router.put('/:id', extraServiceController.updateExtraService);
router.delete('/:id', extraServiceController.deleteExtraService);

export default router;
