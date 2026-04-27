const { Review, Booking, User, Room, RoomType } = require('../models');
const pagination = require('../utils/pagination');

class ReviewController {
  // Create new review
  async createReview(req, res) {
    try {
      const { bookingId, userId, rating, comment } = req.body;

      // Manual validation
      if (!bookingId || !userId || !rating) {
        return res.status(400).json({
          success: false,
          message: 'bookingId, userId, and rating are required'
        });
      }

      const review = await Review.create({
        bookingId,
        userId,
        rating,
        comment
      });

      return res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review
      });
    } catch (error) {
      console.error('Error creating review:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating review',
        error: error.message
      });
    }
  }

  // Get all reviews with pagination and filtering
  async getAllReviews(req, res) {
    try {
      const { page = 1, limit, rating, userId, bookingId } = req.query;

      const where = {};

      // Filter by rating
      if (rating) {
        where.rating = rating;
      }

      // Filter by user
      if (userId) {
        where.userId = userId;
      }

      // Filter by booking
      if (bookingId) {
        where.bookingId = bookingId;
      }

      const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);

      const { count, rows } = await Review.findAndCountAll({
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
                include: [
                  {
                    model: RoomType,
                    as: 'roomType'
                  }
                ]
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          }
        ]
      });

      console.log('All reviews data sample:', JSON.stringify(rows[0] || {}, null, 2));

      return res.status(200).json({
        success: true,
        message: 'Reviews retrieved successfully',
        data: rows,
        pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit)
      });
    } catch (error) {
      console.error('Error getting reviews:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting reviews',
        error: error.message
      });
    }
  }

  // Get reviews by user ID
  async getUserReviews(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required'
        });
      }

      const reviews = await Review.findAll({
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
                include: [
                  {
                    model: RoomType,
                    as: 'roomType'
                  }
                ]
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          }
        ]
      });

      console.log('User reviews data:', JSON.stringify(reviews, null, 2));

      return res.status(200).json({
        success: true,
        message: 'User reviews retrieved successfully',
        data: reviews
      });
    } catch (error) {
      console.error('Error getting user reviews:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting user reviews',
        error: error.message
      });
    }
  }

  // Get review by ID
  async getReviewById(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findByPk(id, {
        include: [
          {
            model: Booking,
            as: 'booking',
            include: [
              {
                model: Room,
                as: 'room',
                include: [
                  {
                    model: RoomType,
                    as: 'roomType'
                  }
                ]
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          }
        ]
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Review retrieved successfully',
        data: review
      });
    } catch (error) {
      console.error('Error getting review:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting review',
        error: error.message
      });
    }
  }

  // Update review
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { bookingId, userId, rating, comment } = req.body;

      const review = await Review.findByPk(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      await review.update({
        bookingId: bookingId || review.bookingId,
        userId: userId || review.userId,
        rating: rating || review.rating,
        comment: comment || review.comment
      });

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: review
      });
    } catch (error) {
      console.error('Error updating review:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating review',
        error: error.message
      });
    }
  }

  // Delete review
  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findByPk(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      await review.destroy();

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting review',
        error: error.message
      });
    }
  }
}

module.exports = new ReviewController();
