    const { PaymentMethod, Payment } = require('../models');

class PaymentMethodService {
  /**
   * Creates a new payment method.
   * @param {Object} data - Payment method details.
   * @param {string} data.methodName - The name of the payment method.
   * @param {string} [data.accountNumber] - The account number associated with the method.
   * @param {boolean} [data.isActive] - Whether the method is active.
   * @returns {Promise<Object>} The created payment method.
   * @throws {Error} If required fields are missing.
   */
  async createPaymentMethod({ methodName, accountNumber, isActive }) {
    if (!methodName) {
      const err = new Error('methodName is required');
      err.statusCode = 400;
      throw err;
    }

    return PaymentMethod.create({
      methodName,
      accountNumber,
      isActive: isActive !== undefined ? isActive : true
    });
  }

  /**
   * Retrieves all available payment methods.
   * @param {Object} query - Query parameters.
   * @param {string} [query.isActive] - Filter by active status ('true' or 'false').
   * @returns {Promise<Array>} List of payment methods.
   */
  async getAllPaymentMethods({ isActive }) {
    const where = {};

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    return PaymentMethod.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Payment,
          as: 'payments'
        }
      ]
    });
  }

  /**
   * Retrieves a specific payment method by ID.
   * @param {string|number} id - The ID of the payment method.
   * @returns {Promise<Object>} The payment method details.
   * @throws {Error} If the payment method is not found.
   */
  async getPaymentMethodById(id) {
    const paymentMethod = await PaymentMethod.findByPk(id, {
      include: [
        {
          model: Payment,
          as: 'payments'
        }
      ]
    });

    if (!paymentMethod) {
      const err = new Error('Payment method not found');
      err.statusCode = 404;
      throw err;
    }

    return paymentMethod;
  }

  /**
   * Updates an existing payment method.
   * @param {string|number} id - The ID of the payment method.
   * @param {Object} data - The data to update.
   * @returns {Promise<Object>} The updated payment method.
   * @throws {Error} If the payment method is not found.
   */
  async updatePaymentMethod(id, { methodName, accountNumber, isActive }) {
    const paymentMethod = await PaymentMethod.findByPk(id);

    if (!paymentMethod) {
      const err = new Error('Payment method not found');
      err.statusCode = 404;
      throw err;
    }

    return paymentMethod.update({
      methodName: methodName || paymentMethod.methodName,
      accountNumber: accountNumber || paymentMethod.accountNumber,
      isActive: isActive !== undefined ? isActive : paymentMethod.isActive
    });
  }

  /**
   * Deletes a payment method.
   * @param {string|number} id - The ID of the payment method.
   * @returns {Promise<void>}
   * @throws {Error} If the payment method is not found.
   */
  async deletePaymentMethod(id) {
    const paymentMethod = await PaymentMethod.findByPk(id);

    if (!paymentMethod) {
      const err = new Error('Payment method not found');
      err.statusCode = 404;
      throw err;
    }

    await paymentMethod.destroy();
  }
}

module.exports = new PaymentMethodService();