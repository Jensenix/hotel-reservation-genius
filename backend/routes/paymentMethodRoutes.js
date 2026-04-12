const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');

// CRUD Routes
router.post('/', paymentMethodController.createPaymentMethod.bind(paymentMethodController));
router.get('/', paymentMethodController.getAllPaymentMethods.bind(paymentMethodController));
router.get('/:id', paymentMethodController.getPaymentMethodById.bind(paymentMethodController));
router.put('/:id', paymentMethodController.updatePaymentMethod.bind(paymentMethodController));
router.delete('/:id', paymentMethodController.deletePaymentMethod.bind(paymentMethodController));

module.exports = router;
