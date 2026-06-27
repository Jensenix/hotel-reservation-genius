import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth/authRoutes.js';
import userRoutes from './routes/users/userRoutes.js';
import roomTypeRoutes from './routes/room/roomTypeRoutes.js';
import facilityRoutes from './routes/room/facilityRoutes.js';
import roomRoutes from './routes/room/roomRoutes.js';
import bookingRoutes from './routes/booking/bookingRoutes.js';
import paymentRoutes from './routes/payment/paymentRoutes.js';
import reviewRoutes from './routes/booking/reviewRoutes.js';
import extraServiceRoutes from './routes/room/extraServiceRoutes.js';
import paymentMethodRoutes from './routes/payment/paymentMethodRoutes.js';
import bookingExtraServiceRoutes from './routes/booking/bookingExtraServiceRoutes.js';
import revenueRoutes from './routes/payment/revenueRoutes.js';
import roomAvailabilityRoutes from './routes/room/roomAvailabilityRoutes.js';
import guestRoutes from './routes/users/guestRoutes.js';

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
