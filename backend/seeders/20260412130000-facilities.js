'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const facilities = [
      {
        facilityName: 'Swimming Pool',
        iconUrl: 'pool',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Fitness Center',
        iconUrl: 'fitness_center',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Spa & Wellness',
        iconUrl: 'spa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Restaurant',
        iconUrl: 'restaurant',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Business Center',
        iconUrl: 'business_center',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Kids Club',
        iconUrl: 'child_care',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Tennis Court',
        iconUrl: 'sports_tennis',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Parking',
        iconUrl: 'local_parking',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Airport Shuttle',
        iconUrl: 'airport_shuttle',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Concierge',
        iconUrl: 'concierge',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Room Service',
        iconUrl: 'room_service',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Laundry Service',
        iconUrl: 'local_laundry_service',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Facilities', facilities, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Facilities', null, {});
  }
};
