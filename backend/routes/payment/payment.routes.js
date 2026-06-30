import express from 'express';
const router = express.Router();

import paymentController from '#controllers/payment/payment.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management APIs
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 150
 *               paymentMethod:
 *                 type: string
 *                 example: credit_card
 *     responses:
 *       201:
 *         description: Payment created successfully
 */
router.post('/', authenticateToken, paymentController.createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment returned successfully
 */
router.get('/:id', authenticateToken, paymentController.getPaymentById);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment updated successfully
 */
router.put('/:id', authenticateToken, paymentController.updatePayment);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments (Admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All payments returned successfully
 */
router.get(
  '/',
  authenticateToken,
  requireAdmin,
  paymentController.getAllPayments,
);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete payment (Admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 */
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  paymentController.deletePayment,
);

export default router;
