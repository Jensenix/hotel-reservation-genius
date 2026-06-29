import express from 'express';
import roomTypeController from '#controllers/room/roomType.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

const router = express.Router();

// Room Type Routes publicly accessible routes
router.get('/', roomTypeController.getAllRoomTypes);
router.get('/with-facilities', roomTypeController.getAllRoomTypesWithFacilities);
router.get('/:id', roomTypeController.getRoomTypeById);

// Admin Routes, used for creating, updating, and deleting room types
router.post('/', authenticateToken, requireAdmin, roomTypeController.createRoomType);
router.put('/:id', authenticateToken, requireAdmin, roomTypeController.updateRoomType);
router.delete('/:id', authenticateToken, requireAdmin, roomTypeController.deleteRoomType);

export default router;