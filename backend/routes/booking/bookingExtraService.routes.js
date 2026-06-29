import express from 'express';
const router = express.Router();
import bookingExtraServiceController from '#controllers/booking/bookingExtraService.controller.js';
import { authenticateToken } from '#middleware/auth.js';

// All actions require standard authentication
router.post('/', authenticateToken, bookingExtraServiceController.createBookingExtraService);
router.get('/booking/:bookingId', authenticateToken, bookingExtraServiceController.getBookingExtraServicesByBookingId);
router.delete('/:id', authenticateToken, bookingExtraServiceController.deleteBookingExtraService);

export default router;