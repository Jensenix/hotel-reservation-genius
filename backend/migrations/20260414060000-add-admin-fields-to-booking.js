'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bookings', 'actualCheckIn', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Bookings', 'actualCheckOut', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Bookings', 'cancelReason', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Bookings', 'cancelledAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Bookings', 'actualCheckIn');
    await queryInterface.removeColumn('Bookings', 'actualCheckOut');
    await queryInterface.removeColumn('Bookings', 'cancelReason');
    await queryInterface.removeColumn('Bookings', 'cancelledAt');
  }
};
