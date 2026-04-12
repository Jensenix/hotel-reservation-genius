const { PaymentMethod, Payment } = require('../models');
const pagination = require('../utils/pagination');

class PaymentMethodController {
  // Create new payment method
  async createPaymentMethod(req, res) {
    try {
      const { methodName, accountNumber, isActive } = req.body;

      // Manual validation
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

  // Get all payment methods with pagination
  async getAllPaymentMethods(req, res) {
    try {
      const { page = 1, limit = 10, isActive } = req.query;

      const where = {};

      // Filter by active status
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);

      const { count, rows } = await PaymentMethod.findAndCountAll({
        where,
        offset,
        limit: parsedLimit,
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
        data: rows,
        pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit)
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

  // Get payment method by ID
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

  // Update payment method
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

  // Delete payment method
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
