const express = require('express');
const router = express.Router();
const bookingExtraServiceController = require('../controllers/bookingExtraServiceController');

// Create booking extra service
router.post('/', bookingExtraServiceController.createBookingExtraService);

// Get booking extra services by booking ID
router.get('/booking/:bookingId', bookingExtraServiceController.getBookingExtraServicesByBookingId);

// Delete booking extra service
router.delete('/:id', bookingExtraServiceController.deleteBookingExtraService);

module.exports = router;
