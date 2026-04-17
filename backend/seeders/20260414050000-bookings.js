'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bookings = [];
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users"`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const rooms = await queryInterface.sequelize.query(
      `SELECT id, "roomTypeId" FROM "Rooms"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || rooms.length === 0) {
      console.log('No users or rooms found, skipping booking seeder');
      return;
    }

    // Create sample bookings
    const sampleBookings = [
      {
        userId: users[0]?.id || 1,
        roomId: rooms[0]?.id || 1,
        checkInDate: new Date('2026-04-15'),
        checkOutDate: new Date('2026-04-17'),
        totalPrice: 200.00,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[0]?.id || 1,
        roomId: rooms[1]?.id || 2,
        checkInDate: new Date('2026-04-20'),
        checkOutDate: new Date('2026-04-22'),
        totalPrice: 300.00,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[1]?.id || 2,
        roomId: rooms[2]?.id || 3,
        checkInDate: new Date('2026-04-10'),
        checkOutDate: new Date('2026-04-12'),
        totalPrice: 250.00,
        status: 'checked_in',
        actualCheckIn: new Date('2026-04-10'),
        createdAt: new Date('2026-04-05'),
        updatedAt: new Date()
      },
      {
        userId: users[1]?.id || 2,
        roomId: rooms[3]?.id || 4,
        checkInDate: new Date('2026-04-08'),
        checkOutDate: new Date('2026-04-10'),
        totalPrice: 180.00,
        status: 'checked_out',
        actualCheckIn: new Date('2026-04-08'),
        actualCheckOut: new Date('2026-04-10'),
        createdAt: new Date('2026-04-01'),
        updatedAt: new Date()
      },
      {
        userId: users[2]?.id || 3,
        roomId: rooms[4]?.id || 5,
        checkInDate: new Date('2026-04-25'),
        checkOutDate: new Date('2026-04-27'),
        totalPrice: 220.00,
        status: 'cancelled',
        cancelReason: 'Guest requested cancellation',
        cancelledAt: new Date('2026-04-20'),
        createdAt: new Date('2026-04-15'),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Bookings', sampleBookings);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', null, {});
  }
};
