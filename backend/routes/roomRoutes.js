const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// CRUD Routes
router.post('/', roomController.createRoom.bind(roomController));
router.get('/', roomController.getAllRooms.bind(roomController));
router.get('/with-room-type', roomController.getAllWithRoomType.bind(roomController));
router.get('/:id', roomController.getRoomById.bind(roomController));
router.put('/:id', roomController.updateRoom.bind(roomController));
router.delete('/:id', roomController.deleteRoom.bind(roomController));

module.exports = router;
