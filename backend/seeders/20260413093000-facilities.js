'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const facilities = [
      {
        facilityName: 'WiFi',
        iconUrl: 'wifi-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Air Conditioning',
        iconUrl: 'ac-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'TV',
        iconUrl: 'tv-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Mini Bar',
        iconUrl: 'mini-bar-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Coffee Maker',
        iconUrl: 'coffee-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Safe Deposit Box',
        iconUrl: 'safe-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Daily Housekeeping',
        iconUrl: 'housekeeping-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Room Service',
        iconUrl: 'room-service-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Work Desk',
        iconUrl: 'desk-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Bathrobe & Slippers',
        iconUrl: 'bathrobe-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Jacuzzi',
        iconUrl: 'jacuzzi-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Balcony',
        iconUrl: 'balcony-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Kids Amenities',
        iconUrl: 'kids-icon.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        facilityName: 'Extra Beds',
        iconUrl: 'bed-icon.svg',
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
