const paymentMethodService = require('../services/payment/paymentMethodService');

class PaymentMethodController {
  /**
   * Handles creating a new payment method.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the newly created payment method.
   */
  async createPaymentMethod(req, res) {
    try {
      const paymentMethod = await paymentMethodService.createPaymentMethod(req.body);
      
      return res.status(201).json({
        success: true,
        message: 'Payment method created successfully',
        data: paymentMethod
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.statusCode ? error.message : 'Error creating payment method',
        error: error.message
      });
    }
  }

  /**
   * Handles retrieving all payment methods.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the array of payment methods.
   */
  async getAllPaymentMethods(req, res) {
    try {
      const paymentMethods = await paymentMethodService.getAllPaymentMethods(req.query);
      
      return res.status(200).json({
        success: true,
        message: 'Payment methods retrieved successfully',
        data: paymentMethods
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error getting payment methods',
        error: error.message
      });
    }
  }

  /**
   * Handles retrieving a specific payment method by ID.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the payment method details.
   */
  async getPaymentMethodById(req, res) {
    try {
      const paymentMethod = await paymentMethodService.getPaymentMethodById(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Payment method retrieved successfully',
        data: paymentMethod
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.statusCode ? error.message : 'Error getting payment method',
        error: error.message
      });
    }
  }

  /**
   * Handles updating an existing payment method.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the updated payment method.
   */
  async updatePaymentMethod(req, res) {
    try {
      const paymentMethod = await paymentMethodService.updatePaymentMethod(req.params.id, req.body);
      
      return res.status(200).json({
        success: true,
        message: 'Payment method updated successfully',
        data: paymentMethod
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.statusCode ? error.message : 'Error updating payment method',
        error: error.message
      });
    }
  }

  /**
   * Handles deleting a payment method.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming deletion.
   */
  async deletePaymentMethod(req, res) {
    try {
      await paymentMethodService.deletePaymentMethod(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Payment method deleted successfully'
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.statusCode ? error.message : 'Error deleting payment method',
        error: error.message
      });
    }
  }
}

module.exports = new PaymentMethodController();