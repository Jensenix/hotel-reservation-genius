import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Defines associations for the Payment model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      Payment.belongsTo(models.Booking, {
        foreignKey: 'bookingId',
        as: 'booking',
      });
      Payment.belongsTo(models.PaymentMethod, {
        foreignKey: 'paymentMethodId',
        as: 'paymentMethod',
      });
    }
  }
  Payment.init(
    {
      bookingId: DataTypes.INTEGER,
      paymentMethodId: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL,
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending',
      },
      transactionTime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Payment',
    },
  );
  return Payment;
};