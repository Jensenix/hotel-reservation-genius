'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Booking, { foreignKey: 'userId', as: 'bookings' });
      User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'staff', 'guest'),
      defaultValue: 'guest'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};