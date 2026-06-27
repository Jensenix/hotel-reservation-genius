import express from 'express';
const router = express.Router();
import reviewController from '../../controllers/booking/reviewController.js';

// CRUD Routes
router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/user', reviewController.getUserReviews);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export default router;
