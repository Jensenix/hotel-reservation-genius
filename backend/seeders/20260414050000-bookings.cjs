'use strict';

const SAMPLE_BOOKINGS = [
  {
    userIndex: 0,
    roomIndex: 0,
    checkInDate: '2026-04-15',
    checkOutDate: '2026-04-17',
    status: 'pending',
    createdAt: new Date('2026-04-10T10:00:00Z'),
  },
  {
    userIndex: 0,
    roomIndex: 5,
    checkInDate: '2026-05-01',
    checkOutDate: '2026-05-03',
    status: 'pending',
    createdAt: new Date('2026-04-28T10:00:00Z'),
  },
  {
    userIndex: 1,
    roomIndex: 9,
    checkInDate: '2026-05-10',
    checkOutDate: '2026-05-12',
    status: 'pending',
    createdAt: new Date('2026-05-01T10:00:00Z'),
  },
  {
    userIndex: 1,
    roomIndex: 8,
    checkInDate: '2026-05-20',
    checkOutDate: '2026-05-22',
    status: 'confirmed',
    createdAt: new Date('2026-05-05T10:00:00Z'),
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Fetch Users, Rooms, and RoomTypes
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const rooms = await queryInterface.sequelize.query(
      `SELECT id, "roomTypeId" FROM "Rooms" ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const roomTypes = await queryInterface.sequelize.query(
      `SELECT id, "basePrice" FROM "RoomTypes"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !rooms.length || !roomTypes.length) {
      console.warn('[bookings seeder] Missing required relational data. Skipping.');
      return;
    }

    // 2. Map Base Prices
    const roomTypePrices = {};
    for (const rt of roomTypes) {
      roomTypePrices[rt.id] = parseFloat(rt.basePrice);
    }

    const rows = [];
    let skipped = 0;

    // 3. Create Deterministic Bookings
    for (const b of SAMPLE_BOOKINGS) {
      const user = users[b.userIndex];
      const room = rooms[b.roomIndex];

      if (!user || !room) {
        skipped++;
        continue;
      }

      // Calculate room price: basePrice × nights
      const ci = new Date(b.checkInDate);
      const co = new Date(b.checkOutDate);
      const nights = Math.round((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
      
      const basePrice = roomTypePrices[room.roomTypeId];
      const roomTotal = basePrice * nights;

      rows.push({
        userId: user.id,
        roomId: room.id,
        checkInDate: ci,
        checkOutDate: co,
        totalPrice: roomTotal, // Room Only. Extras added in the next seeder.
        status: b.status,
        createdAt: b.createdAt,
        updatedAt: new Date(),
      });
    }

    if (skipped > 0) {
      console.log(`[bookings seeder] Skipped ${skipped} sample booking(s).`);
    }

    if (rows.length > 0) {
      await queryInterface.bulkInsert('Bookings', rows);
      console.log(`[bookings seeder] Inserted ${rows.length} booking(s) with base room prices.`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bookings', null, {});
  },
};