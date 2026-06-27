import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth/auth.routes.js';
import userRoutes from './routes/users/user.routes.js';
import roomTypeRoutes from './routes/room/roomType.routes.js';
import facilityRoutes from './routes/room/facility.routes.js';
import roomRoutes from './routes/room/room.routes.js';
import bookingRoutes from './routes/booking/booking.routes.js';
import paymentRoutes from './routes/payment/payment.routes.js';
import reviewRoutes from './routes/booking/review.routes.js';
import extraServiceRoutes from './routes/room/extraService.routes.js';
import paymentMethodRoutes from './routes/payment/paymentMethod.routes.js';
import bookingExtraServiceRoutes from './routes/booking/bookingExtraService.routes.js';
import revenueRoutes from './routes/payment/revenue.routes.js';
import roomAvailabilityRoutes from './routes/room/roomAvailability.routes.js';
import guestRoutes from './routes/users/guest.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Genius Society Hotel API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/extra-services', extraServiceRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/booking-extra-services', bookingExtraServiceRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/room-availability', roomAvailabilityRoutes);
app.use('/api/guests', guestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
