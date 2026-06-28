import paymentService from '#services/payment/payment.service.js';
import BaseController from '../base/base.controller.js';

class PaymentController extends BaseController {
  constructor() {
    super(paymentService, 'Payment');
  }

  createPayment = this.create;
  getAllPayments = this.getAll;
  getPaymentById = this.getById;
  updatePayment = this.update;
  deletePayment = this.delete;
}

export default new PaymentController();