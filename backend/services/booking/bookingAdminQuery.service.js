import db from '#models/index.js';

const { Booking, User, Room, Payment, RoomType } = db;

import { Op } from 'sequelize';

/**
 * @module BookingAdminQueryService
 * Handles admin booking search/list queries.
 *
 * Responsibilities:
 * - Sanitize pagination values
 * - Translate frontend status filters to database status values
 * - Search bookings by ID or guest name
 * - Return admin-friendly booking rows
 */
class BookingAdminQueryService {
  /**
   * Retrieves bookings for the admin dashboard.
   *
   * @param {Object} query Admin query filters
   * @param {string} [query.status] Frontend booking status
   * @param {string} [query.search] Booking ID or guest name
   * @param {string} [query.checkInDate] Minimum check-in date
   * @param {string} [query.checkOutDate] Maximum check-out date
   * @param {number|string} [query.userId] User ID filter
   * @param {number|string} [query.page=1] Current page
   * @param {number|string} [query.limit=10] Items per page
   *
   * @returns {Promise<Object>} Paginated admin booking result
   */
  async getAllBookingsAdmin({
    status,
    search,
    checkInDate,
    checkOutDate,
    userId,
    page = 1,
    limit = 10,
  } = {}) {
    const sanitizedPage = Math.max(1, parseInt(page, 10) || 1);
    const sanitizedLimit = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 10),
    );

    const where = {};

    const statusMapping = {
      pending: 'pending',
      confirmed: 'confirmed',
      'checked-in': 'checked_in',
      'checked-out': 'checked_out',
      cancelled: 'cancelled',
    };

    if (status && statusMapping[status]) {
      where.status = statusMapping[status];
    }

    if (checkInDate && !Number.isNaN(Date.parse(checkInDate))) {
      where.checkInDate = {
        [Op.gte]: checkInDate,
      };
    }

    if (checkOutDate && !Number.isNaN(Date.parse(checkOutDate))) {
      where.checkOutDate = {
        [Op.lte]: checkOutDate,
      };
    }

    if (userId && !Number.isNaN(parseInt(userId, 10))) {
      const parsedUserId = parseInt(userId, 10);

      if (parsedUserId > 0) {
        where.userId = parsedUserId;
      }
    }

    if (search) {
      const searchId = parseInt(search, 10);

      if (!Number.isNaN(searchId) && searchId > 0) {
        where.id = {
          [Op.eq]: searchId,
        };
      } else {
        where[Op.or] = [
          {
            '$user.fullName$': {
              [Op.iLike]: `%${search}%`,
            },
          },
        ];
      }
    }

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phoneNumber'],
        },
        {
          model: Room,
          as: 'room',
          include: [
            {
              model: RoomType,
              as: 'roomType',
              attributes: ['id', 'name', 'maxCapacity'],
            },
          ],
          attributes: ['id', 'roomNumber', 'status'],
        },
        {
          model: Payment,
          as: 'payment',
        },
      ],
      order: [['id', 'DESC']],
      limit: sanitizedLimit,
      offset: (sanitizedPage - 1) * sanitizedLimit,
    });

    const responseStatusMapping = {
      pending: 'pending',
      confirmed: 'confirmed',
      checked_in: 'checked-in',
      checked_out: 'checked-out',
      cancelled: 'cancelled',
    };

    const mappedBookings = bookings.map((booking) => ({
      ...booking.toJSON(),
      status: responseStatusMapping[booking.status] || booking.status,
    }));

    return {
      bookings: mappedBookings,
      pagination: {
        currentPage: sanitizedPage,
        totalPages: Math.ceil(count / sanitizedLimit),
        totalItems: count,
        itemsPerPage: sanitizedLimit,
      },
    };
  }
}

export default new BookingAdminQueryService();
