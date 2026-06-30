import express from 'express';
import guestController from '#controllers/users/guest.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Guests
 *   description: Guest management APIs
 */

/**
 * @swagger
 * /api/guests:
 *   get:
 *     summary: Get all guests with pagination and search (Admin)
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Guests returned successfully
 */
router.get('/', authenticateToken, requireAdmin, guestController.getGuests);

/**
 * @swagger
 * /api/guests/{id}:
 *   get:
 *     summary: Get guest details by ID (Admin)
 *     tags: [Guests]
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
 *         description: Guest details returned successfully
 */
router.get(
  '/:id',
  authenticateToken,
  requireAdmin,
  guestController.getGuestDetails,
);

export default router;
