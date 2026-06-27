import express from 'express';
const router = express.Router();
import bookingController from '#controllers/booking/booking.controller.js';

// CRUD Routes
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);

// Business Logic Routes (must come before /:id)
router.get('/check-availability', bookingController.checkRoomAvailability);
router.get('/available-rooms', bookingController.getAvailableRooms);

// Admin Routes (must come before /:id)
router.get('/admin/all', bookingController.getAllBookingsAdmin);
router.put('/admin/:id/confirm', bookingController.confirmBooking);
router.put('/admin/:id/check-in', bookingController.checkInGuest);
router.put('/admin/:id/check-out', bookingController.checkOutGuest);
router.put('/admin/:id/cancel', bookingController.cancelBooking);

// User-specific routes (must come before /:id)
router.get('/user/:userId', bookingController.getUserBookings);

// CRUD Routes with ID (must come last)
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

export default router;
