import express from 'express';
import roomTypeController from '#controllers/room/roomType.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Room Types
 *   description: Room type management APIs
 */

/**
 * @swagger
 * /api/room-types:
 *   get:
 *     summary: Get all room types
 *     tags: [Room Types]
 *     responses:
 *       200:
 *         description: Room types returned successfully
 */
router.get('/', roomTypeController.getAllRoomTypes);

/**
 * @swagger
 * /api/room-types/with-facilities:
 *   get:
 *     summary: Get all room types with facilities
 *     tags: [Room Types]
 *     responses:
 *       200:
 *         description: Room types with facilities returned successfully
 */
router.get(
  '/with-facilities',
  roomTypeController.getAllRoomTypesWithFacilities,
);

/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     summary: Get room type by ID
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Room type returned successfully
 */
router.get('/:id', roomTypeController.getRoomTypeById);

/**
 * @swagger
 * /api/room-types:
 *   post:
 *     summary: Create room type (Admin)
 *     tags: [Room Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Deluxe Room
 *               price:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: Room type created successfully
 */
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  roomTypeController.createRoomType,
);

/**
 * @swagger
 * /api/room-types/{id}:
 *   put:
 *     summary: Update room type (Admin)
 *     tags: [Room Types]
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
 *         description: Room type updated successfully
 */
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  roomTypeController.updateRoomType,
);

/**
 * @swagger
 * /api/room-types/{id}:
 *   delete:
 *     summary: Delete room type (Admin)
 *     tags: [Room Types]
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
 *         description: Room type deleted successfully
 */
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  roomTypeController.deleteRoomType,
);

export default router;
