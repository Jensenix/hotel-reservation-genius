import express from 'express';
const router = express.Router();
import reviewController from '#controllers/booking/review.controller.js';
import { authenticateToken } from '#middleware/auth.js';

// 1. Static Public Routes
router.get('/', reviewController.getAllReviews);

// 2. Static Protected Routes
router.post('/', authenticateToken, reviewController.createReview);
router.get('/user', authenticateToken, reviewController.getUserReviews);

// 3. Dynamic Routes (Must go LAST to prevent hijacking static paths)
router.get('/:id', reviewController.getReviewById);
router.put('/:id', authenticateToken, reviewController.updateReview);
router.delete('/:id', authenticateToken, reviewController.deleteReview);

export default router;