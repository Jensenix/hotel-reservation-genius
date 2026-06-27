import express from 'express';
const router = express.Router();
import roomController from '#controllers/room/room.controller.js';

// CRUD Routes
router.post('/', roomController.createRoom);
router.get('/', roomController.getAllRooms);
router.get('/with-room-type', roomController.getAllWithRoomType);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

export default router;
