import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RoomTypeFacility extends Model {
    /**
     * Defines associations for the RoomTypeFacility model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      RoomTypeFacility.belongsTo(models.RoomType, {
        foreignKey: 'roomTypeId',
        as: 'roomType',
      });
      RoomTypeFacility.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });
    }
  }

  RoomTypeFacility.init(
    {
      roomTypeId: DataTypes.INTEGER,
      facilityId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'RoomTypeFacility',
    }
  );

  return RoomTypeFacility;
};