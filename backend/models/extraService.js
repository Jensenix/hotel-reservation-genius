'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExtraService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExtraService.belongsToMany(models.Booking, {
        through: 'BookingExtraServices',
        foreignKey: 'extraServiceId',
        otherKey: 'bookingId',
        as: 'bookings'
      });
    }
  }
  ExtraService.init({
    serviceName: DataTypes.STRING,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'ExtraService',
  });
  return ExtraService;
};