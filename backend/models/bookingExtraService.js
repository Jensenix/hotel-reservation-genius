import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class BookingExtraService extends Model {
    /**
     * Defines associations for the BookingExtraService model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      BookingExtraService.belongsTo(models.Booking, {
        foreignKey: 'bookingId',
        as: 'booking',
      });
      BookingExtraService.belongsTo(models.ExtraService, {
        foreignKey: 'extraServiceId',
        as: 'extraService',
      });
    }
  }
  BookingExtraService.init(
    {
      bookingId: DataTypes.INTEGER,
      extraServiceId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      subtotal: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'BookingExtraService',
    },
  );
  return BookingExtraService;
};