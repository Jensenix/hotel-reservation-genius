import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class RoomType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomType.hasMany(models.Room, { foreignKey: 'roomTypeId', as: 'rooms' });
      RoomType.belongsToMany(models.Facility, {
        through: 'RoomTypeFacilities',
        foreignKey: 'roomTypeId',
        otherKey: 'facilityId',
        as: 'facilities',
      });
    }
  }
  RoomType.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      basePrice: DataTypes.DECIMAL,
      maxCapacity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'RoomType',
    },
  );
  return RoomType;
};
