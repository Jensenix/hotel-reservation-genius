const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// CRUD Routes
router.post('/', paymentController.createPayment.bind(paymentController));
router.get('/', paymentController.getAllPayments.bind(paymentController));
router.get('/:id', paymentController.getPaymentById.bind(paymentController));
router.put('/:id', paymentController.updatePayment.bind(paymentController));
router.delete('/:id', paymentController.deletePayment.bind(paymentController));

module.exports = router;
