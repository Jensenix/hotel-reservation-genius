'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      roomTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'RoomTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      floor: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('available', 'occupied', 'maintenance'),
        defaultValue: 'available'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rooms');
  }
};