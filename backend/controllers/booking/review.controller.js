import reviewService from '#services/users/review.service.js';
import BaseController from '../base/base.controller.js';
import { sendResponse } from '#utils/responseHandler.js';

class ReviewController extends BaseController {
  constructor() {
    super(reviewService, 'Review');
  }

  // Alias base controller actions to retain seamless mapping with review routers
  createReview = this.create;
  getAllReviews = this.getAll;
  getReviewById = this.getById;
  updateReview = this.update;
  deleteReview = this.delete;

  /**
   * Custom query filter to retrieve feedback arrays generated exclusively by a specific customer account.
   */
  getUserReviews = async (req, res, next) => {
    try {
      const data = await this.service.getUserReviews(req.query.userId);
      
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || null;

      return sendResponse(res, 200, 'User reviews retrieved successfully', records, pagination);
    } catch (error) {
      next(error);
    }
  };
}

export default new ReviewController();