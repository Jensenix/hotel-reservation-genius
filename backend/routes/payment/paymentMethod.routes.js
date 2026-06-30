import express from 'express';
const router = express.Router();

import paymentMethodController from '#controllers/payment/paymentMethod.controller.js';

/**
 * @swagger
 * tags:
 *   name: Payment Methods
 *   description: Payment method management APIs
 */

/**
 * @swagger
 * /api/payment-methods:
 *   post:
 *     summary: Create payment method
 *     tags: [Payment Methods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Credit Card
 *     responses:
 *       201:
 *         description: Payment method created successfully
 */
router.post('/', paymentMethodController.createPaymentMethod);

/**
 * @swagger
 * /api/payment-methods:
 *   get:
 *     summary: Get all payment methods
 *     tags: [Payment Methods]
 *     responses:
 *       200:
 *         description: Payment methods returned successfully
 */
router.get('/', paymentMethodController.getAllPaymentMethods);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   get:
 *     summary: Get payment method by ID
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment method returned successfully
 */
router.get('/:id', paymentMethodController.getPaymentMethodById);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   put:
 *     summary: Update payment method
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 */
router.put('/:id', paymentMethodController.updatePaymentMethod);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   delete:
 *     summary: Delete payment method
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 */
router.delete('/:id', paymentMethodController.deletePaymentMethod);

export default router;
