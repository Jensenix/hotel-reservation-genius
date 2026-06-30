import express from 'express';
const router = express.Router();

import RoomAvailabilityController from '#controllers/room/roomAvailability.controller.js';

/**
 * @swagger
 * tags:
 *   name: Room Availability
 *   description: Room availability APIs
 */

/**
 * @swagger
 * /api/room-availability:
 *   get:
 *     summary: Get general room availability
 *     tags: [Room Availability]
 *     responses:
 *       200:
 *         description: Room availability returned successfully
 */
router.get('/', RoomAvailabilityController.getRoomAvailability);

/**
 * @swagger
 * /api/room-availability/stats:
 *   get:
 *     summary: Get room availability statistics
 *     tags: [Room Availability]
 *     responses:
 *       200:
 *         description: Room availability statistics returned successfully
 */
router.get('/stats', RoomAvailabilityController.getRoomAvailability);

/**
 * @swagger
 * /api/room-availability/room-type/{roomTypeId}:
 *   get:
 *     summary: Get availability by room type
 *     tags: [Room Availability]
 *     parameters:
 *       - in: path
 *         name: roomTypeId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Room type availability returned successfully
 */
router.get(
  '/room-type/:roomTypeId',
  RoomAvailabilityController.getRoomTypeAvailability,
);

export default router;
