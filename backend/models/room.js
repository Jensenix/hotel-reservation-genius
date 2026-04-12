'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.belongsTo(models.RoomType, { foreignKey: 'roomTypeId', as: 'roomType' });
      Room.hasMany(models.Booking, { foreignKey: 'roomId', as: 'bookings' });
    }
  }
  Room.init({
    roomNumber: DataTypes.STRING,
    roomTypeId: DataTypes.INTEGER,
    floor: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
      defaultValue: 'available'
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};