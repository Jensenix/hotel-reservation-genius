'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const facilities = [
      // Basic facilities (ID 1-14)
      {
        facilityName: 'WiFi',
        iconUrl: 'wifi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Air Conditioning',
        iconUrl: 'ac',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'TV',
        iconUrl: 'tv',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Mini Bar',
        iconUrl: 'local_bar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Coffee Maker',
        iconUrl: 'coffee',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Safe Deposit Box',
        iconUrl: 'security',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Daily Housekeeping',
        iconUrl: 'cleaning_services',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Room Service',
        iconUrl: 'room_service',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Work Desk',
        iconUrl: 'desk',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Bathrobe & Slippers',
        iconUrl: 'checkroom',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Jacuzzi',
        iconUrl: 'hot_tub',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Balcony',
        iconUrl: 'balcony',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Kids Amenities',
        iconUrl: 'child_care',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Extra Beds',
        iconUrl: 'bed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Specialized facilities (ID 15-34)
      {
        facilityName: 'Ocean View',
        iconUrl: 'beach_access',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Mountain View',
        iconUrl: 'landscape',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Private Garden',
        iconUrl: 'yard',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Outdoor Terrace',
        iconUrl: 'deck',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Fireplace',
        iconUrl: 'fireplace',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Kitchenette',
        iconUrl: 'kitchen',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Private Elevator',
        iconUrl: 'elevator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Wine Cellar',
        iconUrl: 'wine_bar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Home Theater',
        iconUrl: 'theater_comedy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Rooftop Terrace',
        iconUrl: 'roofing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Beach Access',
        iconUrl: 'beach_access',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Hammock',
        iconUrl: 'weekend',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Outdoor Shower',
        iconUrl: 'shower',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'BBQ Grill',
        iconUrl: 'outdoor_grill',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Wood Burning Stove',
        iconUrl: 'fireplace',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Deck',
        iconUrl: 'deck',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Hot Tub',
        iconUrl: 'hot_tub',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'High Ceiling',
        iconUrl: 'height',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Exposed Brick',
        iconUrl: 'wall',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Workspace',
        iconUrl: 'workspaces',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Hotel facilities (ID 35+)
      {
        facilityName: 'Swimming Pool',
        iconUrl: 'pool',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Fitness Center',
        iconUrl: 'fitness_center',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Spa & Wellness',
        iconUrl: 'spa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Restaurant',
        iconUrl: 'restaurant',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Business Center',
        iconUrl: 'business_center',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Kids Club',
        iconUrl: 'child_care',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Tennis Court',
        iconUrl: 'sports_tennis',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Parking',
        iconUrl: 'local_parking',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Airport Shuttle',
        iconUrl: 'airport_shuttle',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Concierge',
        iconUrl: 'concierge',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        facilityName: 'Laundry Service',
        iconUrl: 'local_laundry_service',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Facilities', facilities, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Facilities', null, {});
  },
};
