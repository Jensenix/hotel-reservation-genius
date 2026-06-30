import express from 'express';
const router = express.Router();

import bookingController from '#controllers/booking/booking.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management APIs
 */

/**
 * @swagger
 * /api/bookings/check-availability:
 *   get:
 *     summary: Check room availability
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: checkIn
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: checkOut
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Available rooms returned
 */
router.get('/check-availability', bookingController.checkRoomAvailability);

/**
 * @swagger
 * /api/bookings/available-rooms:
 *   get:
 *     summary: Get available rooms
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of available rooms
 */
router.get('/available-rooms', bookingController.getAvailableRooms);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', authenticateToken, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/user/{userId}:
 *   get:
 *     summary: Get bookings by user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get(
  '/user/:userId',
  authenticateToken,
  bookingController.getUserBookings,
);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', authenticateToken, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticateToken, bookingController.updateBooking);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel own booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/:id/cancel',
  authenticateToken,
  bookingController.selfCancelBooking,
);

/**
 * @swagger
 * /api/bookings/{id}/self-check-in:
 *   put:
 *     summary: User self check-in
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/:id/self-check-in',
  authenticateToken,
  bookingController.selfCheckIn,
);

/**
 * @swagger
 * /api/bookings/{id}/self-check-out:
 *   put:
 *     summary: User self check-out
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/:id/self-check-out',
  authenticateToken,
  bookingController.selfCheckOut,
);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (Admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/',
  authenticateToken,
  requireAdmin,
  bookingController.getAllBookings,
);

/**
 * @swagger
 * /api/bookings/admin/all:
 *   get:
 *     summary: Get all bookings for admin dashboard
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/admin/all',
  authenticateToken,
  requireAdmin,
  bookingController.getAllBookingsAdmin,
);

/**
 * @swagger
 * /api/bookings/admin/{id}/confirm:
 *   put:
 *     summary: Confirm booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/admin/:id/confirm',
  authenticateToken,
  requireAdmin,
  bookingController.confirmBooking,
);

/**
 * @swagger
 * /api/bookings/admin/{id}/check-in:
 *   put:
 *     summary: Admin check-in guest
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/admin/:id/check-in',
  authenticateToken,
  requireAdmin,
  bookingController.checkInGuest,
);

/**
 * @swagger
 * /api/bookings/admin/{id}/check-out:
 *   put:
 *     summary: Admin check-out guest
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/admin/:id/check-out',
  authenticateToken,
  requireAdmin,
  bookingController.checkOutGuest,
);

/**
 * @swagger
 * /api/bookings/admin/{id}/cancel:
 *   put:
 *     summary: Cancel booking (Admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  '/admin/:id/cancel',
  authenticateToken,
  requireAdmin,
  bookingController.cancelBooking,
);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete booking (Admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  bookingController.deleteBooking,
);

export default router;
