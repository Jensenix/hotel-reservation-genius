import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
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
