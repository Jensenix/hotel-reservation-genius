import BaseController from '#controllers/base/base.controller.js';
import paymentMethodService from '#services/payment/paymentMethod.service.js';

class PaymentMethodController extends BaseController {
  createPaymentMethod = this.asyncHandler(async (req, res) => {
    const data = await paymentMethodService.createPaymentMethod(req.body);
    this.sendCreated(res, 'Payment method created successfully', data);
  });

  getAllPaymentMethods = this.asyncHandler(async (req, res) => {
    const data = await paymentMethodService.getAllPaymentMethods(req.query);
    this.sendSuccess(res, 'Payment methods retrieved successfully', data);
  });

  getPaymentMethodById = this.asyncHandler(async (req, res) => {
    const data = await paymentMethodService.getPaymentMethodById(req.params.id);
    this.sendSuccess(res, 'Payment method retrieved successfully', data);
  });

  updatePaymentMethod = this.asyncHandler(async (req, res) => {
    const data = await paymentMethodService.updatePaymentMethod(req.params.id, req.body);
    this.sendSuccess(res, 'Payment method updated successfully', data);
  });

  deletePaymentMethod = this.asyncHandler(async (req, res) => {
    await paymentMethodService.deletePaymentMethod(req.params.id);
    this.sendSuccess(res, 'Payment method deleted successfully');
  });
}

export default new PaymentMethodController();