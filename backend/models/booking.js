'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    checkInDate: DataTypes.DATE,
    checkOutDate: DataTypes.DATE,
    totalPrice: DataTypes.DECIMAL,
    bookingStatus: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};