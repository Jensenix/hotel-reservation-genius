import express from 'express';
const router = express.Router();

import bookingExtraServiceController from '#controllers/booking/bookingExtraService.controller.js';
import { authenticateToken } from '#middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Booking Extra Services
 *   description: Manage additional services attached to bookings
 */

/**
 * @swagger
 * /api/booking-extra-services:
 *   post:
 *     summary: Create booking extra service
 *     tags: [Booking Extra Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 1
 *               extraServiceId:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Booking extra service created
 */
router.post(
  '/',
  authenticateToken,
  bookingExtraServiceController.createBookingExtraService,
);

/**
 * @swagger
 * /api/booking-extra-services/booking/{bookingId}:
 *   get:
 *     summary: Get extra services by booking ID
 *     tags: [Booking Extra Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Booking extra services returned
 */
router.get(
  '/booking/:bookingId',
  authenticateToken,
  bookingExtraServiceController.getBookingExtraServicesByBookingId,
);

/**
 * @swagger
 * /api/booking-extra-services/{id}:
 *   delete:
 *     summary: Delete booking extra service
 *     tags: [Booking Extra Services]
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
 *         description: Booking extra service deleted
 */
router.delete(
  '/:id',
  authenticateToken,
  bookingExtraServiceController.deleteBookingExtraService,
);

export default router;
