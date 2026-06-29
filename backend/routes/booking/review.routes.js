import express from 'express';
const router = express.Router();
import reviewController from '#controllers/booking/review.controller.js';
import { authenticateToken } from '#middleware/auth.js'; // <-- Import this (Admin not required)

// Public Routes
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);

// Protected Routes (Logged-in users only)
router.post('/', authenticateToken, reviewController.createReview);
router.get('/user', authenticateToken, reviewController.getUserReviews);
router.put('/:id', authenticateToken, reviewController.updateReview);
router.delete('/:id', authenticateToken, reviewController.deleteReview);

export default router;