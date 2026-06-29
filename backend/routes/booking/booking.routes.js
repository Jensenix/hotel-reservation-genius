import express from 'express';
const router = express.Router();
import bookingController from '#controllers/booking/booking.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

// Public Business Logic Routes
router.get('/check-availability', bookingController.checkRoomAvailability);
router.get('/available-rooms', bookingController.getAvailableRooms);

// User-specific routes (Must be logged in)
router.post('/', authenticateToken, bookingController.createBooking);
router.get('/user/:userId', authenticateToken, bookingController.getUserBookings);
router.get('/:id', authenticateToken, bookingController.getBookingById);
router.put('/:id', authenticateToken, bookingController.updateBooking);

// User explicit actions (These map to endpoints correctly aligned with frontend)
router.put('/:id/cancel', authenticateToken, bookingController.selfCancelBooking);
router.put('/:id/self-check-in', authenticateToken, bookingController.selfCheckIn);
router.put('/:id/self-check-out', authenticateToken, bookingController.selfCheckOut);

// Admin Routes (Strictly protected)
router.get('/', authenticateToken, requireAdmin, bookingController.getAllBookings);
router.get('/admin/all', authenticateToken, requireAdmin, bookingController.getAllBookingsAdmin);
router.put('/admin/:id/confirm', authenticateToken, requireAdmin, bookingController.confirmBooking);
router.put('/admin/:id/check-in', authenticateToken, requireAdmin, bookingController.checkInGuest);
router.put('/admin/:id/check-out', authenticateToken, requireAdmin, bookingController.checkOutGuest);
router.put('/admin/:id/cancel', authenticateToken, requireAdmin, bookingController.cancelBooking);
router.delete('/:id', authenticateToken, requireAdmin, bookingController.deleteBooking);

export default router;