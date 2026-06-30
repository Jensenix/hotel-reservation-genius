import express from 'express';
const router = express.Router();
import reviewController from '#controllers/booking/review.controller.js';
import { authenticateToken } from '#middleware/auth.js';

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Retrieve all reviews
 *     tags: [Reviews]
 */
router.get('/', reviewController.getAllReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     security: [{ bearerAuth: [] }]
 *     tags: [Reviews]
 */
router.post('/', authenticateToken, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/user:
 *   get:
 *     summary: Get current user's reviews
 *     security: [{ bearerAuth: [] }]
 *     tags: [Reviews]
 */
router.get('/user', authenticateToken, reviewController.getUserReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.get('/:id', reviewController.getReviewById);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     security: [{ bearerAuth: [] }]
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.put('/:id', authenticateToken, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     security: [{ bearerAuth: [] }]
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.delete('/:id', authenticateToken, reviewController.deleteReview);

export default router;
