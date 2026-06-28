import paymentMethodService from '#services/payment/paymentMethod.service.js';
import BaseController from '../base/base.controller.js';

class PaymentMethodController extends BaseController {
  constructor() {
    super(paymentMethodService, 'Payment method');
  }

  createPaymentMethod = this.create;
  getAllPaymentMethods = this.getAll;
  getPaymentMethodById = this.getById;
  updatePaymentMethod = this.update;
  deletePaymentMethod = this.delete;
}

export default new PaymentMethodController();