import db from '../../models/index.js';
const { User, Booking, Payment, Review } = db;
import { Op } from 'sequelize';

class GuestService {
  /**
   * Retrieves a paginated list of guests with their booking statistics.
   * @param {number} page - The page number.
   * @param {number} limit - The number of records per page.
   * @param {string} search - The search term for name or email.
   * @param {string} role - The role to filter by.
   * @returns {Promise<Object>} An object containing guest data and pagination details.
   */
  async getGuests(page = 1, limit = 10, search = '', role = 'guest') {
    const offset = (page - 1) * limit;
    const whereCondition = { role };

    if (search) {
      whereCondition[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const count = await User.count({ where: whereCondition });

    const { rows: guests } = await User.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Booking,
          as: 'bookings',
          include: [{ model: Payment, as: 'payment' }],
        },
        {
          model: Review,
          as: 'reviews',
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    const formattedGuests = guests.map((guest) => {
      const bookings = guest.bookings || [];
      const paidBookings = bookings.filter(
        (booking) =>
          booking.payment && booking.payment.paymentStatus === 'paid',
      );
      const totalSpent = paidBookings.reduce(
        (sum, booking) => sum + parseFloat(booking.payment.amount),
        0,
      );
      const averageRating =
        guest.reviews.length > 0
          ? guest.reviews.reduce((sum, review) => sum + review.rating, 0) /
            guest.reviews.length
          : 0;
      const lastBookingDate =
        bookings.length > 0
          ? new Date(Math.max(...bookings.map((b) => new Date(b.createdAt))))
          : null;

      return {
        id: guest.id,
        fullName: guest.fullName,
        email: guest.email,
        phoneNumber: guest.phoneNumber,
        role: guest.role,
        createdAt: guest.createdAt,
        totalBookings: bookings.length,
        completedBookings: paidBookings.length,
        totalSpent,
        averageRating,
        reviewCount: guest.reviews.length,
        lastBookingDate,
      };
    });

    return {
      guests: formattedGuests,
      totalGuests: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      hasMore: page * limit < count,
    };
  }

  /**
   * Retrieves detailed information and history for a specific guest.
   * @param {string|number} id - The ID of the guest.
   * @returns {Promise<Object>} Detailed guest data.
   * @throws {Error} If the guest is not found.
   */
  async getGuestDetails(id) {
    const guest = await User.findOne({
      where: { id, role: 'guest' },
      include: [
        {
          model: Booking,
          as: 'bookings',
          include: [{ model: Payment, as: 'payment' }],
          order: [['createdAt', 'DESC']],
        },
        {
          model: Review,
          as: 'reviews',
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!guest) {
      const error = new Error('Guest not found');
      error.statusCode = 404;
      throw error;
    }

    const bookings = guest.bookings || [];
    const paidBookings = bookings.filter(
      (booking) => booking.payment && booking.payment.paymentStatus === 'paid',
    );
    const totalSpent = paidBookings.reduce(
      (sum, booking) => sum + parseFloat(booking.payment.amount),
      0,
    );
    const averageRating =
      guest.reviews.length > 0
        ? guest.reviews.reduce((sum, review) => sum + review.rating, 0) /
          guest.reviews.length
        : 0;
    const lastBookingDate =
      bookings.length > 0
        ? new Date(Math.max(...bookings.map((b) => new Date(b.createdAt))))
        : null;

    return {
      id: guest.id,
      fullName: guest.fullName,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      role: guest.role,
      createdAt: guest.createdAt,
      totalBookings: bookings.length,
      completedBookings: paidBookings.length,
      totalSpent,
      averageRating,
      reviewCount: guest.reviews.length,
      lastBookingDate,
      bookings: bookings.map((booking) => ({
        id: booking.id,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        status: booking.status,
        totalPrice: booking.totalPrice,
        payment: booking.payment,
      })),
      reviews: guest.reviews,
    };
  }
}

export default new GuestService();
