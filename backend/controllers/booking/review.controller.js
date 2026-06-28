import BaseController from '#controllers/base/base.controller.js';
import reviewService from '#services/users/review.service.js';

class ReviewController extends BaseController {
  createReview = this.asyncHandler(async (req, res) => {
    const data = await reviewService.createReview(req.body);
    this.sendCreated(res, 'Review created successfully', data);
  });

  getAllReviews = this.asyncHandler(async (req, res) => {
    const data = await reviewService.getAllReviews(req.query);
    this.sendPaginated(res, 'Reviews retrieved successfully', data.rows, data.pagination);
  });

  getUserReviews = this.asyncHandler(async (req, res) => {
    const data = await reviewService.getUserReviews(req.query.userId);
    this.sendSuccess(res, 'User reviews retrieved successfully', data);
  });

  getReviewById = this.asyncHandler(async (req, res) => {
    const data = await reviewService.getReviewById(req.params.id);
    this.sendSuccess(res, 'Review retrieved successfully', data);
  });

  updateReview = this.asyncHandler(async (req, res) => {
    const data = await reviewService.updateReview(req.params.id, req.body);
    this.sendSuccess(res, 'Review updated successfully', data);
  });

  deleteReview = this.asyncHandler(async (req, res) => {
    await reviewService.deleteReview(req.params.id);
    this.sendSuccess(res, 'Review deleted successfully');
  });
}

export default new ReviewController();