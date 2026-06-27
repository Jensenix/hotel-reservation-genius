'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const extraServices = [
      {
        serviceName: 'Airport Transfer',
        price: 50.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Spa Package',
        price: 120.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Romantic Dinner',
        price: 200.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'City Tour',
        price: 80.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Late Checkout',
        price: 30.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Early Check-in',
        price: 25.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Breakfast in Bed',
        price: 15.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Pet Accommodation',
        price: 20.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Meeting Room Rental',
        price: 40.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Laundry Service',
        price: 18.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Car Rental',
        price: 100.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Photography Service',
        price: 150.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Birthday Package',
        price: 75.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Anniversary Package',
        price: 90.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serviceName: 'Business Package',
        price: 35.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('ExtraServices', extraServices, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ExtraServices', null, {});
  },
};
