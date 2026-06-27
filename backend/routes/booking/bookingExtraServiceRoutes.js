import express from 'express';
const router = express.Router();
import bookingExtraServiceController from '../../controllers/booking/bookingExtraServiceController.js';

// Create booking extra service
router.post('/', bookingExtraServiceController.createBookingExtraService);

// Get booking extra services by booking ID
router.get(
  '/booking/:bookingId',
  bookingExtraServiceController.getBookingExtraServicesByBookingId,
);

// Delete booking extra service
router.delete('/:id', bookingExtraServiceController.deleteBookingExtraService);

export default router;
