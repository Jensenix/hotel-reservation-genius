'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingExtraService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BookingExtraService.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
      BookingExtraService.belongsTo(models.ExtraService, { foreignKey: 'extraServiceId', as: 'extraService' });
    }
  }
  BookingExtraService.init({
    bookingId: DataTypes.INTEGER,
    extraServiceId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    subtotal: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'BookingExtraService',
  });
  return BookingExtraService;
};