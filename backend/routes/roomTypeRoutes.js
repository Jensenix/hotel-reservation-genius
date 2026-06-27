import express from 'express';
import roomTypeController from '../controllers/roomTypeController.js';
const router = express.Router();

// CRUD Routes
router.post('/', roomTypeController.createRoomType);
router.get('/', roomTypeController.getAllRoomTypes);
router.get(
  '/with-facilities',
  roomTypeController.getAllRoomTypesWithFacilities,
);
router.get('/:id', roomTypeController.getRoomTypeById);
router.put('/:id', roomTypeController.updateRoomType);
router.delete('/:id', roomTypeController.deleteRoomType);

export default router;
