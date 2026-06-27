'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123', // In production, this should be hashed
        role: 'guest',
        phoneNumber: '+1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        role: 'guest',
        phoneNumber: '+0987654321',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: 'Admin User',
        email: 'admin@geniussocietyhotel.com',
        password: 'admin123',
        role: 'admin',
        phoneNumber: '+1122334455',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
