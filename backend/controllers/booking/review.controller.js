import BaseController from '#controllers/base/base.controller.js';
import reviewService from '#services/users/review.service.js';

class ReviewController extends BaseController {
  /**
   * Creates a new review.
   */
  createReview = this.asyncHandler(async (req, res) => {
    const data = await reviewService.createReview(req.body);
    this.sendCreated(res, 'Review created successfully', data);
  });

  /**
   * Retrieves all reviews (paginated).
   */
  getAllReviews = this.asyncHandler(async (req, res) => {
    const data = await reviewService.getAllReviews(req.query);
    this.sendPaginated(res, 'Reviews retrieved successfully', data.rows, data.pagination);
  });

  /**
   * Retrieves reviews made by a specific user.
   */
  getUserReviews = this.asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.query.userId;
    const data = await reviewService.getUserReviews(userId);
    this.sendSuccess(res, 'User reviews retrieved successfully', data);
  });

  /**
   * Retrieves a single review by ID.
   */
  getReviewById = this.asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (isNaN(parseInt(id))) {
      const err = new Error('Invalid review ID format');
      err.statusCode = 400;
      throw err;
    }

    const data = await reviewService.getReviewById(id);
    this.sendSuccess(res, 'Review retrieved successfully', data);
  });

  /**
   * Updates an existing review.
   */
  updateReview = this.asyncHandler(async (req, res) => {
    const data = await reviewService.updateReview(req.params.id, req.body);
    this.sendSuccess(res, 'Review updated successfully', data);
  });

  /**
   * Deletes a review.
   */
  deleteReview = this.asyncHandler(async (req, res) => {
    await reviewService.deleteReview(req.params.id);
    this.sendSuccess(res, 'Review deleted successfully');
  });
}

export default new ReviewController();