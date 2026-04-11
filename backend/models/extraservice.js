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
      // define association here
    }
  }
  ExtraService.init({
    serviceName: DataTypes.STRING,
    servicePrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'ExtraService',
  });
  return ExtraService;
};