import express from 'express';
const router = express.Router();
import paymentController from '#controllers/payment/payment.controller.js';
import { authenticateToken, requireAdmin } from '#middleware/auth.js';

// User accessible payment routes
router.post('/', authenticateToken, paymentController.createPayment);
router.get('/:id', authenticateToken, paymentController.getPaymentById);
router.put('/:id', authenticateToken, paymentController.updatePayment);

// Admin only routes
router.get('/', authenticateToken, requireAdmin, paymentController.getAllPayments);
router.delete('/:id', authenticateToken, requireAdmin, paymentController.deletePayment);

export default router;