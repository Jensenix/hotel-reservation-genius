'use strict';

const TARGET_BOOKINGS = [
  {
    userIndex: 0,
    roomIndex: 0,
    checkInDate: '2026-04-15',
    checkOutDate: '2026-04-17',
    extras: [{ serviceIndex: 0, quantity: 1 }], // Airport Transfer
  },
  {
    userIndex: 0,
    roomIndex: 5,
    checkInDate: '2026-05-01',
    checkOutDate: '2026-05-03',
    extras: [
      { serviceIndex: 1, quantity: 2 }, // Spa Package
    ],
  },
  {
    userIndex: 1,
    roomIndex: 9,
    checkInDate: '2026-05-10',
    checkOutDate: '2026-05-12',
    extras: [
      { serviceIndex: 0, quantity: 1 }, // Airport Transfer
      { serviceIndex: 2, quantity: 1 }, // Romantic Dinner
    ],
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Fetch Relational Data
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const rooms = await queryInterface.sequelize.query(
      `SELECT id FROM "Rooms" ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const extraServices = await queryInterface.sequelize.query(
      `SELECT id, price FROM "ExtraServices" ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const bookings = await queryInterface.sequelize.query(
      `SELECT id, "userId", "roomId", "checkInDate", "checkOutDate", "totalPrice" FROM "Bookings"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !rooms.length || !extraServices.length || !bookings.length) {
      console.warn('[booking-extra-services] Missing foundational data. Skipping.');
      return;
    }

    const extraServiceRows = [];

    // 2. Attach Extras and Calculate New Totals
    for (const target of TARGET_BOOKINGS) {
      const user = users[target.userIndex];
      const room = rooms[target.roomIndex];
      if (!user || !room) {continue;}

      // Find the specific booking injected by the previous seeder safely handling JS dates
      const booking = bookings.find(b => 
        b.userId === user.id &&
        b.roomId === room.id &&
        new Date(b.checkInDate).toISOString().startsWith(target.checkInDate) &&
        new Date(b.checkOutDate).toISOString().startsWith(target.checkOutDate)
      );

      if (!booking) {continue;}

      let additionalTotal = 0;

      // Process Extras
      for (const extra of target.extras) {
        const service = extraServices[extra.serviceIndex];
        if (!service) {continue;}

        const subtotal = parseFloat(service.price) * extra.quantity;
        additionalTotal += subtotal;

        extraServiceRows.push({
          bookingId: booking.id,
          extraServiceId: service.id,
          quantity: extra.quantity,
          subtotal,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 3. Update the Parent Booking's totalPrice
      if (additionalTotal > 0) {
        const newTotal = parseFloat(booking.totalPrice) + additionalTotal;

        await queryInterface.sequelize.query(
          `UPDATE "Bookings" SET "totalPrice" = :newTotal, "updatedAt" = NOW() WHERE id = :bookingId`,
          {
            replacements: {
              newTotal,
              bookingId: booking.id,
            },
            type: Sequelize.QueryTypes.UPDATE,
          }
        );
      }
    }

    if (extraServiceRows.length > 0) {
      await queryInterface.bulkInsert('BookingExtraServices', extraServiceRows);
      console.log(`[booking-extra-services] Inserted ${extraServiceRows.length} rows and updated Booking totals.`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BookingExtraServices', null, {});
  },
};