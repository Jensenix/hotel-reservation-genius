'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
      Payment.belongsTo(models.PaymentMethod, { foreignKey: 'paymentMethodId', as: 'paymentMethod' });
    }
  }
  Payment.init({
    bookingId: DataTypes.INTEGER,
    paymentMethodId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    transactionTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};