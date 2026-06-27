import reviewService from '#services/users/review.service.js';

class ReviewController {
  createReview = async (req, res) => {
    try {
      const data = await reviewService.createReview(req.body);
      res
        .status(201)
        .json({ success: true, message: 'Review created successfully', data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  getAllReviews = async (req, res) => {
    try {
      const data = await reviewService.getAllReviews(req.query);
      res.status(200).json({
        success: true,
        message: 'Reviews retrieved successfully',
        data: data.rows,
        pagination: data.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting reviews',
        error: error.message,
      });
    }
  };

  getUserReviews = async (req, res) => {
    try {
      const data = await reviewService.getUserReviews(req.query.userId);
      res.status(200).json({
        success: true,
        message: 'User reviews retrieved successfully',
        data,
      });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  getReviewById = async (req, res) => {
    try {
      const data = await reviewService.getReviewById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Review retrieved successfully',
        data,
      });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  updateReview = async (req, res) => {
    try {
      const data = await reviewService.updateReview(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, message: 'Review updated successfully', data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  deleteReview = async (req, res) => {
    try {
      await reviewService.deleteReview(req.params.id);
      res
        .status(200)
        .json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };
}

export default new ReviewController();
