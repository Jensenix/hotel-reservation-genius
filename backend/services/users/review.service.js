import db from '#models/index.js';
const { Review, Booking, User, Room, RoomType } = db;
import pagination from '#utils/pagination.js';
import BaseService from '../base/base.service.js';

class ReviewService extends BaseService {
  constructor() {
    super(Review, 'Review');
  }

  /**
   * Creates a new review for a booking.
   * @param {Object} data - Review data.
   * @param {string|number} data.bookingId - The ID of the booking being reviewed.
   * @param {string|number} data.userId - The ID of the user leaving the review.
   * @param {number} data.rating - The rating given by the user.
   * @param {string} [data.comment] - The review comment.
   * @returns {Promise<Object>} The created review.
   * @throws {Error} If bookingId, userId, or rating are missing.
   */
  async createReview({ bookingId, userId, rating, comment }) {
    if (!bookingId || !userId || !rating) {
      const err = new Error('bookingId, userId, and rating are required');
      err.statusCode = 400;
      throw err;
    }
    return super.create({ bookingId, userId, rating, comment });
  }

  /**
   * Retrieves all reviews with support for pagination and filtering.
   * @param {Object} query - The query parameters.
   * @param {number} [query.page=1] - The page number.
   * @param {number} [query.limit] - The number of records per page.
   * @param {number} [query.rating] - Filter by specific rating.
   * @param {string|number} [query.userId] - Filter by user ID.
   * @param {string|number} [query.bookingId] - Filter by booking ID.
   * @returns {Promise<Object>} An object containing the rows and pagination details.
   */
  async getAllReviews({ page = 1, limit, rating, userId, bookingId }) {
    const where = {};
    if (rating) where.rating = rating;
    if (userId) where.userId = userId;
    if (bookingId) where.bookingId = bookingId;

    const { offset, limit: parsedLimit } = pagination.getPagination(
      page,
      limit,
    );
    const { count, rows } = await super.getAll({
      where,
      offset,
      limit: parsedLimit,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Booking,
          as: 'booking',
          include: [
            {
              model: Room,
              as: 'room',
              include: [{ model: RoomType, as: 'roomType' }],
            },
          ],
        },
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
      ],
    });

    return {
      rows,
      pagination: pagination.getPagingData(
        { count, rows },
        parseInt(page),
        parsedLimit,
      ),
    };
  }

  /**
   * Retrieves all reviews left by a specific user.
   * @param {string|number} userId - The ID of the user.
   * @returns {Promise<Array>} Array of reviews belonging to the user.
   * @throws {Error} If userId is not provided.
   */
  async getUserReviews(userId) {
    if (!userId) {
      const err = new Error('userId is required');
      err.statusCode = 400;
      throw err;
    }
    return super.getAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Booking,
          as: 'booking',
          include: [
            {
              model: Room,
              as: 'room',
              include: [{ model: RoomType, as: 'roomType' }],
            },
          ],
        },
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
      ],
    });
  }

  /**
   * Retrieves a specific review by ID.
   * @param {string|number} id - The ID of the review.
   * @returns {Promise<Object>} The review data with associated booking and user details.
   * @throws {Error} If the review is not found.
   */
  async getReviewById(id) {
    return super.getById(id, {
      include: [
        {
          model: Booking,
          as: 'booking',
          include: [
            {
              model: Room,
              as: 'room',
              include: [{ model: RoomType, as: 'roomType' }],
            },
          ],
        },
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
      ],
    });
  }

  /**
   * Updates an existing review.
   * @param {string|number} id - The ID of the review to update.
   * @param {Object} data - The data to update.
   * @returns {Promise<Object>} The updated review.
   * @throws {Error} If the review is not found.
   */
  async updateReview(id, data) {
    return super.update(id, data);
  }

  /**
   * Deletes a review.
   * @param {string|number} id - The ID of the review to delete.
   * @returns {Promise<void>}
   * @throws {Error} If the review is not found.
   */
  async deleteReview(id) {
    return super.delete(id);
  }
}

export default new ReviewService();
