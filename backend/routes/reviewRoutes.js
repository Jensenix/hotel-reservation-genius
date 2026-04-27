const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// CRUD Routes
router.post('/', reviewController.createReview.bind(reviewController));
router.get('/', reviewController.getAllReviews.bind(reviewController));
router.get('/user', reviewController.getUserReviews.bind(reviewController));
router.get('/:id', reviewController.getReviewById.bind(reviewController));
router.put('/:id', reviewController.updateReview.bind(reviewController));
router.delete('/:id', reviewController.deleteReview.bind(reviewController));

module.exports = router;
