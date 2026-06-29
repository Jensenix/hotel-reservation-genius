import express from 'express';
const router = express.Router();
import roomController from '#controllers/room/room.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js'; // <-- Import this

// Public Routes (Anyone can view rooms)
router.get('/', roomController.getAllRooms);
router.get('/with-room-type', roomController.getAllWithRoomType);
router.get('/:id', roomController.getRoomById);

// Protected Admin Routes (Only admins can modify rooms)
router.post('/', authenticateToken, requireAdmin, roomController.createRoom);
router.put('/:id', authenticateToken, requireAdmin, roomController.updateRoom);
router.delete('/:id', authenticateToken, requireAdmin, roomController.deleteRoom);

export default router;