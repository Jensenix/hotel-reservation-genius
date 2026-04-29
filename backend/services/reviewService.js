const { Review, Booking, User, Room, RoomType } = require('../models');
const pagination = require('../utils/pagination');

class ReviewService {
  /**
   * Creates a new review.
   * @param {Object} data - Review data.
   * @returns {Promise<Object>} Created review.
   */
  async createReview({ bookingId, userId, rating, comment }) {
    if (!bookingId || !userId || !rating) {
      const err = new Error('bookingId, userId, and rating are required'); err.statusCode = 400; throw err;
    }
    return Review.create({ bookingId, userId, rating, comment });
  }

  /**
   * Retrieves all reviews with pagination.
   * @param {Object} query - Query params.
   * @returns {Promise<Object>} Paginated reviews.
   */
  async getAllReviews({ page = 1, limit, rating, userId, bookingId }) {
    const where = {};
    if (rating) where.rating = rating;
    if (userId) where.userId = userId;
    if (bookingId) where.bookingId = bookingId;

    const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);
    const { count, rows } = await Review.findAndCountAll({
      where, offset, limit: parsedLimit, order: [['createdAt', 'DESC']],
      include: [
        { model: Booking, as: 'booking', include: [{ model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] }] },
        { model: User, as: 'user', attributes: { exclude: ['password'] } }
      ]
    });

    return { rows, pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit) };
  }

  /**
   * Retrieves reviews left by a specific user.
   * @param {string|number} userId - User ID.
   * @returns {Promise<Array>} User's reviews.
   */
  async getUserReviews(userId) {
    if (!userId) {
      const err = new Error('userId is required'); err.statusCode = 400; throw err;
    }
    return Review.findAll({
      where: { userId }, order: [['createdAt', 'DESC']],
      include: [
        { model: Booking, as: 'booking', include: [{ model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] }] },
        { model: User, as: 'user', attributes: { exclude: ['password'] } }
      ]
    });
  }

  /**
   * Retrieves a specific review by ID.
   * @param {string|number} id - Review ID.
   * @returns {Promise<Object>} Review data.
   */
  async getReviewById(id) {
    const review = await Review.findByPk(id, {
      include: [
        { model: Booking, as: 'booking', include: [{ model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] }] },
        { model: User, as: 'user', attributes: { exclude: ['password'] } }
      ]
    });
    if (!review) {
      const err = new Error('Review not found'); err.statusCode = 404; throw err;
    }
    return review;
  }

  /**
   * Updates an existing review.
   * @param {string|number} id - Review ID.
   * @param {Object} data - Update data.
   * @returns {Promise<Object>} Updated review.
   */
  async updateReview(id, data) {
    const review = await Review.findByPk(id);
    if (!review) {
      const err = new Error('Review not found'); err.statusCode = 404; throw err;
    }
    return review.update(data);
  }

  /**
   * Deletes a review.
   * @param {string|number} id - Review ID.
   * @returns {Promise<void>}
   */
  async deleteReview(id) {
    const review = await Review.findByPk(id);
    if (!review) {
      const err = new Error('Review not found'); err.statusCode = 404; throw err;
    }
    await review.destroy();
  }
}

module.exports = new ReviewService();