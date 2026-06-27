import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Booking.belongsTo(models.Room, { foreignKey: 'roomId', as: 'room' });
      Booking.hasOne(models.Payment, {
        foreignKey: 'bookingId',
        as: 'payment',
      });
      Booking.hasMany(models.Review, {
        foreignKey: 'bookingId',
        as: 'reviews',
      });
      Booking.belongsToMany(models.ExtraService, {
        through: 'BookingExtraServices',
        foreignKey: 'bookingId',
        otherKey: 'extraServiceId',
        as: 'extraServices',
      });
    }
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      checkInDate: DataTypes.DATE,
      checkOutDate: DataTypes.DATE,
      totalPrice: DataTypes.DECIMAL,
      status: {
        type: DataTypes.ENUM(
          'pending',
          'confirmed',
          'checked_in',
          'checked_out',
          'cancelled',
        ),
        defaultValue: 'pending',
      },
      actualCheckIn: DataTypes.DATE,
      actualCheckOut: DataTypes.DATE,
      cancelReason: DataTypes.TEXT,
      cancelledAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Booking',
    },
  );
  return Booking;
};
