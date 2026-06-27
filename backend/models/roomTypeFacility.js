import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class RoomTypeFacility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
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