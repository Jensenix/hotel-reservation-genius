import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ExtraService extends Model {
    /**
     * Defines associations for the ExtraService model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      ExtraService.belongsToMany(models.Booking, {
        through: 'BookingExtraServices',
        foreignKey: 'extraServiceId',
        otherKey: 'bookingId',
        as: 'bookings',
      });
    }
  }
  ExtraService.init(
    {
      serviceName: DataTypes.STRING,
      price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'ExtraService',
    },
  );
  return ExtraService;
};