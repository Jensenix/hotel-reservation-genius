'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rooms = [
      {
        roomNumber: 'A109',
        roomTypeId: 1, // Standard Room
        floor: 1,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomNumber: 'A103',
        roomTypeId: 1, // Standard Room
        floor: 1,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomNumber: 'B203',
        roomTypeId: 2, // Deluxe Room
        floor: 2,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomNumber: 'B204',
        roomTypeId: 2, // Deluxe Room
        floor: 2,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomNumber: 'C302',
        roomTypeId: 3, // Executive Suite
        floor: 3,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomNumber: 'D402',
        roomTypeId: 4, // Presidential Suite
        floor: 4,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomNumber: 'E502',
        roomTypeId: 5, // Family Room
        floor: 5,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Rooms', rooms, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rooms', null, {});
  }
};
