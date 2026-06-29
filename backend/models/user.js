import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Defines associations for the User model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      User.hasMany(models.Booking, { foreignKey: 'userId', as: 'bookings' });
      User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
    }
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM('admin', 'staff', 'guest'),
        defaultValue: 'guest',
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
