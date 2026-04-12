'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Facility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Facility.belongsToMany(models.RoomType, {
        through: 'RoomTypeFacilities',
        foreignKey: 'facilityId',
        otherKey: 'roomTypeId',
        as: 'roomTypes'
      });
    }
  }
  Facility.init({
    facilityName: DataTypes.STRING,
    iconUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Facility',
  });
  return Facility;
};