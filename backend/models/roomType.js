import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class RoomType extends Model {
    /**
     * Defines associations for the RoomType model.
     * @param {Object} models - All loaded Sequelize models
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
