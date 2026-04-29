const { PaymentMethod, Payment } = require('../models');

class PaymentMethodController {
  /**
   * Creates a new payment method.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the newly created payment method.
   */
  async createPaymentMethod(req, res) {
    try {
      const { methodName, accountNumber, isActive } = req.body;

      if (!methodName) {
        return res.status(400).json({
          success: false,
          message: 'methodName is required'
        });
      }

      const paymentMethod = await PaymentMethod.create({
        methodName,
        accountNumber,
        isActive: isActive !== undefined ? isActive : true
      });

      return res.status(201).json({
        success: true,
        message: 'Payment method created successfully',
        data: paymentMethod
      });
    } catch (error) {
      console.error('Error creating payment method:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating payment method',
        error: error.message
      });
    }
  }

  /**
   * Retrieves all available payment methods.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the array of payment methods.
   */
  async getAllPaymentMethods(req, res) {
    try {
      const { isActive } = req.query;

      const where = {};

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const paymentMethods = await PaymentMethod.findAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Payment,
            as: 'payments'
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Payment methods retrieved successfully',
        data: paymentMethods
      });
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting payment methods',
        error: error.message
      });
    }
  }

  /**
   * Retrieves a specific payment method by ID.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the payment method details.
   */
  async getPaymentMethodById(req, res) {
    try {
      const { id } = req.params;

      const paymentMethod = await PaymentMethod.findByPk(id, {
        include: [
          {
            model: Payment,
            as: 'payments'
          }
        ]
      });

      if (!paymentMethod) {
        return res.status(404).json({
          success: false,
          message: 'Payment method not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment method retrieved successfully',
        data: paymentMethod
      });
    } catch (error) {
      console.error('Error getting payment method:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting payment method',
        error: error.message
      });
    }
  }

  /**
   * Updates an existing payment method.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the updated payment method.
   */
  async updatePaymentMethod(req, res) {
    try {
      const { id } = req.params;
      const { methodName, accountNumber, isActive } = req.body;

      const paymentMethod = await PaymentMethod.findByPk(id);

      if (!paymentMethod) {
        return res.status(404).json({
          success: false,
          message: 'Payment method not found'
        });
      }

      await paymentMethod.update({
        methodName: methodName || paymentMethod.methodName,
        accountNumber: accountNumber || paymentMethod.accountNumber,
        isActive: isActive !== undefined ? isActive : paymentMethod.isActive
      });

      return res.status(200).json({
        success: true,
        message: 'Payment method updated successfully',
        data: paymentMethod
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating payment method',
        error: error.message
      });
    }
  }

  /**
   * Deletes a payment method.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming deletion.
   */
  async deletePaymentMethod(req, res) {
    try {
      const { id } = req.params;

      const paymentMethod = await PaymentMethod.findByPk(id);

      if (!paymentMethod) {
        return res.status(404).json({
          success: false,
          message: 'Payment method not found'
        });
      }

      await paymentMethod.destroy();

      return res.status(200).json({
        success: true,
        message: 'Payment method deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting payment method',
        error: error.message
      });
    }
  }
}

module.exports = new PaymentMethodController();