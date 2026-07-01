import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Defines associations for the Room model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      Room.belongsTo(models.RoomType, {
        foreignKey: 'roomTypeId',
        as: 'roomType',
      });
      Room.hasMany(models.Booking, { foreignKey: 'roomId', as: 'bookings' });
    }
  }
  Room.init(
    {
      roomNumber: DataTypes.STRING,
      roomTypeId: DataTypes.INTEGER,
      floor: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'cleaning'),
        defaultValue: 'available',
      },
    },
    {
      sequelize,
      modelName: 'Room',
    },
  );
  return Room;
};