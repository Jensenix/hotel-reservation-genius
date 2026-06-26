const express = require('express');
const router = express.Router();
const RoomAvailabilityController = require('../controllers/roomAvailabilityController');

// Get general room availability 
router.get('/', RoomAvailabilityController.getRoomAvailability);

// Get room availability statistics 
router.get('/stats', RoomAvailabilityController.getRoomAvailability);

// Get detailed availability for specific room type
router.get('/room-type/:roomTypeId', RoomAvailabilityController.getRoomTypeAvailability);

module.exports = router;