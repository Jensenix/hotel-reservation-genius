import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    /**
     * Defines associations for the PaymentMethod model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      PaymentMethod.hasMany(models.Payment, {
        foreignKey: 'paymentMethodId',
        as: 'payments',
      });
    }
  }
  PaymentMethod.init(
    {
      methodName: DataTypes.STRING,
      accountNumber: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'PaymentMethod',
    },
  );
  return PaymentMethod;
};