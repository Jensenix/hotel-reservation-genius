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
      },
      {
        name: 'Ocean View Suite',
        description: 'Luxurious suite with panoramic ocean views, separate living area, and premium amenities',
        basePrice: 450.00,
        maxCapacity: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mountain View Villa',
        description: 'Spacious villa with mountain views, private garden, and outdoor terrace',
        basePrice: 380.00,
        maxCapacity: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Garden Cottage',
        description: 'Cozy cottage surrounded by beautiful gardens, perfect for romantic getaways',
        basePrice: 180.00,
        maxCapacity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Penthouse Apartment',
        description: 'Ultra-luxurious penthouse with city skyline views and private rooftop terrace',
        basePrice: 750.00,
        maxCapacity: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Beach Bungalow',
        description: 'Beachfront bungalow with direct beach access and tropical ambiance',
        basePrice: 320.00,
        maxCapacity: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Forest Lodge',
        description: 'Rustic luxury lodge nestled in forest with wildlife viewing opportunities',
        basePrice: 280.00,
        maxCapacity: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'City Loft',
        description: 'Modern urban loft with industrial chic design and city views',
        basePrice: 220.00,
        maxCapacity: 3,
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
