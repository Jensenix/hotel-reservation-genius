import express from 'express';
const router = express.Router();
import facilityController from '#controllers/room/facility.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

router.get('/', facilityController.getAllFacilities);
router.get('/:id', facilityController.getFacilityById);
router.post('/', authenticateToken, requireAdmin, facilityController.createFacility);
router.put('/:id', authenticateToken, requireAdmin, facilityController.updateFacility);
router.delete('/:id', authenticateToken, requireAdmin, facilityController.deleteFacility);

export default router;