const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// CRUD Routes
router.post('/', bookingController.createBooking.bind(bookingController));
router.get('/', bookingController.getAllBookings.bind(bookingController));

// Business Logic Routes (must come before /:id)
router.get('/check-availability', bookingController.checkRoomAvailability.bind(bookingController));
router.get('/available-rooms', bookingController.getAvailableRooms.bind(bookingController));

// Admin Routes (must come before /:id)
router.get('/admin/all', bookingController.getAllBookingsAdmin.bind(bookingController));
router.put('/admin/:id/confirm', bookingController.confirmBooking.bind(bookingController));
router.put('/admin/:id/check-in', bookingController.checkInGuest.bind(bookingController));
router.put('/admin/:id/check-out', bookingController.checkOutGuest.bind(bookingController));
router.put('/admin/:id/cancel', bookingController.cancelBooking.bind(bookingController));

// User-specific routes (must come before /:id)
router.get('/user/:userId', bookingController.getUserBookings.bind(bookingController));

// CRUD Routes with ID (must come last)
router.get('/:id', bookingController.getBookingById.bind(bookingController));
router.put('/:id', bookingController.updateBooking.bind(bookingController));
router.delete('/:id', bookingController.deleteBooking.bind(bookingController));

module.exports = router;
