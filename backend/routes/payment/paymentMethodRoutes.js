import express from 'express';
const router = express.Router();
import paymentMethodController from '#controllers/payment/paymentMethodController.js';

// CRUD Routes
router.post('/', paymentMethodController.createPaymentMethod);
router.get('/', paymentMethodController.getAllPaymentMethods);
router.get('/:id', paymentMethodController.getPaymentMethodById);
router.put('/:id', paymentMethodController.updatePaymentMethod);
router.delete('/:id', paymentMethodController.deletePaymentMethod);

export default router;
