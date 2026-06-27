'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const paymentMethods = [
      {
        methodName: 'Credit Card',
        accountNumber: '****-****-****-1234',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        methodName: 'Debit Card',
        accountNumber: '****-****-****-5678',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        methodName: 'Bank Transfer',
        accountNumber: '123-456-7890',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        methodName: 'PayPal',
        accountNumber: 'paypal@geniussocietyhotel.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        methodName: 'Cash on Arrival',
        accountNumber: 'N/A',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        methodName: 'Digital Wallet',
        accountNumber: 'digital@geniussocietyhotel.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('PaymentMethods', paymentMethods, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PaymentMethods', null, {});
  },
};
