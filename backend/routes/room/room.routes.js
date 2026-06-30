import express from 'express';
const router = express.Router();

import roomController from '#controllers/room/room.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management APIs
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Rooms returned successfully
 */
router.get('/', roomController.getAllRooms);

/**
 * @swagger
 * /api/rooms/with-room-type:
 *   get:
 *     summary: Get all rooms with room type details
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Rooms with room types returned successfully
 */
router.get('/with-room-type', roomController.getAllWithRoomType);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Room returned successfully
 */
router.get('/:id', roomController.getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create room (Admin)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomNumber:
 *                 type: string
 *                 example: 101
 *               roomTypeId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: available
 *     responses:
 *       201:
 *         description: Room created successfully
 */
router.post('/', authenticateToken, requireAdmin, roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update room (Admin)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Room updated successfully
 */
router.put('/:id', authenticateToken, requireAdmin, roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete room (Admin)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Room deleted successfully
 */
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  roomController.deleteRoom,
);

export default router;
