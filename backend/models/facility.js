import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Facility extends Model {
    /**
     * Defines associations for the Facility model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      Facility.belongsToMany(models.RoomType, {
        through: 'RoomTypeFacilities',
        foreignKey: 'facilityId',
        otherKey: 'roomTypeId',
        as: 'roomTypes',
      });
    }
  }
  Facility.init(
    {
      facilityName: DataTypes.STRING,
      iconUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Facility',
    },
  );
  return Facility;
};