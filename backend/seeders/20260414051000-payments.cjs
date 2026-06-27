'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bookings = await queryInterface.sequelize.query(
      `SELECT id, "totalPrice" FROM "Bookings" WHERE "status" IN ('confirmed', 'checked_in', 'checked_out')`,
      { type: Sequelize.QueryTypes.SELECT },
    );
    const paymentMethods = await queryInterface.sequelize.query(
      `SELECT id FROM "PaymentMethods" LIMIT 3`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (bookings.length === 0 || paymentMethods.length === 0) {
      console.log(
        'No bookings or payment methods found, skipping payment seeder',
      );
      return;
    }

    const payments = bookings.map((booking, index) => ({
      bookingId: booking.id,
      paymentMethodId: paymentMethods[index % paymentMethods.length]?.id || 1,
      amount: booking.totalPrice,
      paymentStatus: 'paid',
      transactionTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Payments', payments);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Payments', null, {});
  },
};
