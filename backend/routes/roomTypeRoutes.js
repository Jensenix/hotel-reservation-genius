const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');

// CRUD Routes
router.post('/', roomTypeController.createRoomType.bind(roomTypeController));
router.get('/', roomTypeController.getAllRoomTypes.bind(roomTypeController));
router.get('/with-facilities', roomTypeController.getAllRoomTypesWithFacilities.bind(roomTypeController));
router.get('/:id', roomTypeController.getRoomTypeById.bind(roomTypeController));
router.put('/:id', roomTypeController.updateRoomType.bind(roomTypeController));
router.delete('/:id', roomTypeController.deleteRoomType.bind(roomTypeController));

module.exports = router;
