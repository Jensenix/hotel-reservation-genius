const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// CRUD Routes
router.post('/', bookingController.createBooking.bind(bookingController));
router.get('/', bookingController.getAllBookings.bind(bookingController));
router.get('/:id', bookingController.getBookingById.bind(bookingController));
router.put('/:id', bookingController.updateBooking.bind(bookingController));
router.delete('/:id', bookingController.deleteBooking.bind(bookingController));

module.exports = router;
