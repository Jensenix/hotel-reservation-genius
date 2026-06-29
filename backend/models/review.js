import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Defines associations for the Review model.
     * @param {Object} models - All loaded Sequelize models
     */
    static associate(models) {
      Review.belongsTo(models.Booking, {
        foreignKey: 'bookingId',
        as: 'booking',
      });
      Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Review.init(
    {
      bookingId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Review',
    },
  );
  return Review;
};