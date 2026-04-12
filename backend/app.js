const express = require('express');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const roomTypeRoutes = require('./routes/roomTypeRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const extraServiceRoutes = require('./routes/extraServiceRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');

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
app.use('/api/users', userRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/extra-services', extraServiceRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
