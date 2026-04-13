'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const roomTypeFacilities = [
      // Standard Room (roomTypeId: 1) - Basic facilities
      {
        roomTypeId: 1,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 1,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 1,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 1,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Deluxe Room (roomTypeId: 2) - Standard + Premium facilities
      {
        roomTypeId: 2,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 2,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 2,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 2,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 2,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 2,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 2,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Executive Suite (roomTypeId: 3) - Deluxe + Executive facilities
      {
        roomTypeId: 3,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 6, // Safe Deposit Box
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 9, // Work Desk
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 3,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Presidential Suite (roomTypeId: 4) - Executive + Luxury facilities
      {
        roomTypeId: 4,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 6, // Safe Deposit Box
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 9, // Work Desk
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 11, // Jacuzzi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 4,
        facilityId: 12, // Balcony
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Family Room (roomTypeId: 5) - Standard + Family facilities
      {
        roomTypeId: 5,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 5,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 5,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 5,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 5,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 5,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 5,
        facilityId: 13, // Kids Amenities
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 5,
        facilityId: 14, // Extra Beds
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('RoomTypeFacilities', roomTypeFacilities, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoomTypeFacilities', null, {});
  }
};
