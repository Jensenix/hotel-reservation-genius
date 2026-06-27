import paymentService from '#services/payment/payment.service.js';

class PaymentController {
  createPayment = async (req, res) => {
    try {
      const data = await paymentService.createPayment(req.body);
      res
        .status(201)
        .json({ success: true, message: 'Payment created successfully', data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  getAllPayments = async (req, res) => {
    try {
      const data = await paymentService.getAllPayments(req.query);
      res.status(200).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: data.rows,
        pagination: data.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting payments',
        error: error.message,
      });
    }
  };

  getPaymentById = async (req, res) => {
    try {
      const data = await paymentService.getPaymentById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Payment retrieved successfully',
        data,
      });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  updatePayment = async (req, res) => {
    try {
      const data = await paymentService.updatePayment(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, message: 'Payment updated successfully', data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  deletePayment = async (req, res) => {
    try {
      await paymentService.deletePayment(req.params.id);
      res
        .status(200)
        .json({ success: true, message: 'Payment deleted successfully' });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };
}

export default new PaymentController();
