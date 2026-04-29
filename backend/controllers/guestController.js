const { User, Booking, Payment, Review } = require('../models');
const { Op } = require('sequelize');

/**
 * Retrieves a paginated list of guests, optionally filtered by search term, along with booking statistics.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response with guest data and pagination info.
 */
const getGuests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = 'guest' } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {
      role: role
    };

    if (search) {
      whereCondition[Op.or] = [
        {
          fullName: {
            [Op.like]: `%${search}%`
          }
        },
        {
          email: {
            [Op.like]: `%${search}%`
          }
        }
      ];
    }

    const count = await User.count({
      where: whereCondition
    });

    const { rows: guests } = await User.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Booking,
          as: 'bookings',
          include: [
            {
              model: Payment,
              as: 'payment'
            }
          ]
        },
        {
          model: Review,
          as: 'reviews'
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const formattedGuests = guests.map(guest => {
      const bookings = guest.bookings || [];
      const paidBookings = bookings.filter(booking => 
        booking.payment && booking.payment.paymentStatus === 'paid'
      );
      const totalSpent = paidBookings.reduce((sum, booking) => {
        return sum + parseFloat(booking.payment.amount);
      }, 0);

      return {
        id: guest.id,
        fullName: guest.fullName,
        email: guest.email,
        phoneNumber: guest.phoneNumber,
        role: guest.role,
        createdAt: guest.createdAt,
        totalBookings: bookings.length,
        completedBookings: paidBookings.length,
        totalSpent: totalSpent,
        averageRating: guest.reviews.length > 0 
          ? guest.reviews.reduce((sum, review) => sum + review.rating, 0) / guest.reviews.length 
          : 0,
        reviewCount: guest.reviews.length,
        lastBookingDate: bookings.length > 0 
          ? new Date(Math.max(...bookings.map(b => new Date(b.createdAt)))) 
          : null
      };
    });

    res.json({
      guests: formattedGuests,
      totalGuests: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      hasMore: page * limit < count
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ 
      message: 'Error fetching guests',
      error: error.message 
    });
  }
};

/**
 * Retrieves detailed information about a specific guest, including their full booking history and reviews.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response with detailed guest data.
 */
const getGuestDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const guest = await User.findOne({
      where: { id, role: 'guest' },
      include: [
        {
          model: Booking,
          as: 'bookings',
          include: [
            {
              model: Payment,
              as: 'payment'
            }
          ],
          order: [['createdAt', 'DESC']]
        },
        {
          model: Review,
          as: 'reviews',
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    const bookings = guest.bookings || [];
    const paidBookings = bookings.filter(booking => 
      booking.payment && booking.payment.paymentStatus === 'paid'
    );
    const totalSpent = paidBookings.reduce((sum, booking) => {
      return sum + parseFloat(booking.payment.amount);
    }, 0);

    const formattedGuest = {
      id: guest.id,
      fullName: guest.fullName,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      role: guest.role,
      createdAt: guest.createdAt,
      totalBookings: bookings.length,
      completedBookings: paidBookings.length,
      totalSpent: totalSpent,
      averageRating: guest.reviews.length > 0 
        ? guest.reviews.reduce((sum, review) => sum + review.rating, 0) / guest.reviews.length 
        : 0,
      reviewCount: guest.reviews.length,
      lastBookingDate: bookings.length > 0 
        ? new Date(Math.max(...bookings.map(b => new Date(b.createdAt)))) 
        : null,
      bookings: bookings.map(booking => ({
        id: booking.id,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        status: booking.status,
        totalPrice: booking.totalPrice,
        payment: booking.payment
      })),
      reviews: guest.reviews
    };

    res.json(formattedGuest);
  } catch (error) {
    console.error('Error fetching guest details:', error);
    res.status(500).json({ 
      message: 'Error fetching guest details',
      error: error.message 
    });
  }
};

module.exports = {
  getGuests,
  getGuestDetails
};