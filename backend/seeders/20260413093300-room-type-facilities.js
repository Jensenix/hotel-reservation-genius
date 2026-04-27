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
      },

      // Ocean View Suite (roomTypeId: 6) - Presidential + Ocean-specific facilities
      {
        roomTypeId: 6,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 6, // Safe Deposit Box
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 9, // Work Desk
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 11, // Jacuzzi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 12, // Balcony
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 6,
        facilityId: 15, // Ocean View
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Mountain View Villa (roomTypeId: 7) - Presidential + Mountain-specific facilities
      {
        roomTypeId: 7,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 6, // Safe Deposit Box
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 9, // Work Desk
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 11, // Jacuzzi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 12, // Balcony
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 16, // Mountain View
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 17, // Private Garden
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 7,
        facilityId: 18, // Outdoor Terrace
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Garden Cottage (roomTypeId: 8) - Deluxe + Garden-specific facilities
      {
        roomTypeId: 8,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 12, // Balcony
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 17, // Private Garden
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 19, // Fireplace
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 8,
        facilityId: 20, // Kitchenette
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Penthouse Apartment (roomTypeId: 9) - Ultimate luxury facilities
      {
        roomTypeId: 9,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 6, // Safe Deposit Box
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 9, // Work Desk
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 11, // Jacuzzi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 12, // Balcony
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 21, // Private Elevator
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 22, // Wine Cellar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 23, // Home Theater
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 9,
        facilityId: 24, // Rooftop Terrace
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Beach Bungalow (roomTypeId: 10) - Deluxe + Beach-specific facilities
      {
        roomTypeId: 10,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 12, // Balcony
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 25, // Beach Access
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 26, // Hammock
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 27, // Outdoor Shower
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 10,
        facilityId: 28, // BBQ Grill
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Forest Lodge (roomTypeId: 11) - Deluxe + Forest-specific facilities
      {
        roomTypeId: 11,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 12, // Balcony
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 16, // Mountain View
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 19, // Fireplace
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 29, // Wood Burning Stove
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 30, // Deck
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 11,
        facilityId: 31, // Hot Tub
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // City Loft (roomTypeId: 12) - Deluxe + Urban-specific facilities
      {
        roomTypeId: 12,
        facilityId: 1, // WiFi
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 2, // Air Conditioning
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 3, // TV
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 4, // Mini Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 5, // Coffee Maker
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 6, // Safe Deposit Box
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 7, // Daily Housekeeping
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 8, // Room Service
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 9, // Work Desk
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 10, // Bathrobe & Slippers
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 32, // High Ceiling
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 33, // Exposed Brick
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 20, // Kitchenette
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomTypeId: 12,
        facilityId: 34, // Workspace
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
