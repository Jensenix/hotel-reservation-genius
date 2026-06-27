import express from 'express';
const router = express.Router();
import paymentController from '#controllers/payment/payment.controller.js';

// CRUD Routes
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

export default router;
