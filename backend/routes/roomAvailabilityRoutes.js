import express from 'express';
const router = express.Router();
import RoomAvailabilityController from '../controllers/roomAvailabilityController.js';

// Get general room availability
router.get('/', RoomAvailabilityController.getRoomAvailability);

// Get room availability statistics
router.get('/stats', RoomAvailabilityController.getRoomAvailability);

// Get detailed availability for specific room type
router.get(
  '/room-type/:roomTypeId',
  RoomAvailabilityController.getRoomTypeAvailability,
);

export default router;
