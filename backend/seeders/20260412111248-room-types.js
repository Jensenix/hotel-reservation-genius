'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const roomTypes = [
      {
        name: 'Standard Room',
        description: 'Comfortable standard room with basic amenities perfect for budget travelers',
        basePrice: 50.00,
        maxCapacity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Deluxe Room',
        description: 'Spacious deluxe room with premium amenities and city view',
        basePrice: 85.00,
        maxCapacity: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Executive Suite',
        description: 'Luxurious executive suite with separate living area and workspace',
        basePrice: 150.00,
        maxCapacity: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Presidential Suite',
        description: 'Ultimate luxury suite with panoramic views and butler service',
        basePrice: 300.00,
        maxCapacity: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Family Room',
        description: 'Spacious family room with interconnected bedrooms and kid-friendly amenities',
        basePrice: 120.00,
        maxCapacity: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('RoomTypes', roomTypes, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoomTypes', null, {});
  }
};
