import BaseController from '#controllers/base/base.controller.js';
import paymentMethodService from '#services/payment/paymentMethod.service.js';

class PaymentMethodController extends BaseController {
  /**
   * Creates a new payment method type.
   */
  createPaymentMethod = this.asyncHandler(async (req, res) => {
    const data = await paymentMethodService.createPaymentMethod(req.body);
    this.sendCreated(res, 'Payment method created successfully', data);
  });

  /**
   * Retrieves all available payment methods.
   */
  getAllPaymentMethods = this.asyncHandler(async (req, res) => {
    const data = await paymentMethodService.getAllPaymentMethods(req.query);
    this.sendSuccess(res, 'Payment methods retrieved successfully', data);
  });

  /**
   * Retrieves payment method by ID.
   */
  getPaymentMethodById = this.asyncHandler(async (req, res) => {
    const data = await paymentMethodService.getPaymentMethodById(req.params.id);
    this.sendSuccess(res, 'Payment method retrieved successfully', data);
  });

  /**
   * Updates a payment method.
   */
  updatePaymentMethod = this.asyncHandler(async (req, res) => {
    const data = await paymentMethodService.updatePaymentMethod(req.params.id, req.body);
    this.sendSuccess(res, 'Payment method updated successfully', data);
  });

  /**
   * Deletes a payment method.
   */
  deletePaymentMethod = this.asyncHandler(async (req, res) => {
    await paymentMethodService.deletePaymentMethod(req.params.id);
    this.sendSuccess(res, 'Payment method deleted successfully');
  });
}

export default new PaymentMethodController();