import BaseController from '#controllers/base/base.controller.js';
import paymentService from '#services/payment/payment.service.js';

class PaymentController extends BaseController {
  /**
   * Creates a payment record.
   */
  createPayment = this.asyncHandler(async (req, res) => {
    const data = await paymentService.createPayment(req.body);
    this.sendCreated(res, 'Payment created successfully', data);
  });

  /**
   * Retrieves all payments (paginated).
   */
  getAllPayments = this.asyncHandler(async (req, res) => {
    const data = await paymentService.getAllPayments(req.query);
    this.sendPaginated(res, 'Payments retrieved successfully', data.rows, data.pagination);
  });

  /**
   * Retrieves payment by ID.
   */
  getPaymentById = this.asyncHandler(async (req, res) => {
    const data = await paymentService.getPaymentById(req.params.id);
    this.sendSuccess(res, 'Payment retrieved successfully', data);
  });

  /**
   * Updates a payment record.
   */
  updatePayment = this.asyncHandler(async (req, res) => {
    const data = await paymentService.updatePayment(req.params.id, req.body);
    this.sendSuccess(res, 'Payment updated successfully', data);
  });

  /**
   * Deletes a payment record.
   */
  deletePayment = this.asyncHandler(async (req, res) => {
    await paymentService.deletePayment(req.params.id);
    this.sendSuccess(res, 'Payment deleted successfully');
  });
}

export default new PaymentController();