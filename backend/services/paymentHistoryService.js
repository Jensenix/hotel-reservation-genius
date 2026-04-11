const BaseService = require('./baseService');

class PaymentHistoryService extends BaseService {
  constructor(model) {
    super(model);
  }

  async getPaymentHistory(userId) {
    return await this.model.findAll({
      include: [{
        model: require('../models').Booking,
        as: 'booking',
        where: { userId },
        include: [
          { model: require('../models').User, as: 'user' },
          { model: require('../models').Room, as: 'room' }
        ]
      }],
      order: [['paymentDate', 'DESC']]
    });
  }

  async getPaymentStats() {
    const totalPayments = await this.model.count();
    const paidPayments = await this.model.count({ where: { paymentStatus: 'paid' } });
    const pendingPayments = await this.model.count({ where: { paymentStatus: 'pending' } });
    
    return {
      total: totalPayments,
      paid: paidPayments,
      pending: pendingPayments
    };
  }
}

module.exports = PaymentHistoryService;
