import express from 'express';
const router = express.Router();
import facilityController from '#controllers/room/facility.controller.js';

// CRUD Routes
router.post('/', facilityController.createFacility);
router.get('/', facilityController.getAllFacilities);
router.get('/:id', facilityController.getFacilityById);
router.put('/:id', facilityController.updateFacility);
router.delete('/:id', facilityController.deleteFacility);

export default router;
