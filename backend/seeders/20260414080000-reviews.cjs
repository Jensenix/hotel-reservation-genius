'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Dynamically fetch available bookings to guarantee valid foreign keys
    const bookings = await queryInterface.sequelize.query(
      `SELECT id, "userId" FROM "Bookings" ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!bookings || bookings.length === 0) {
      console.log('[reviews seeder] No bookings found, skipping reviews.');
      return;
    }

    // 2. Define review templates without hardcoded IDs
    const reviewTemplates = [
      {
        rating: 5,
        comment:
          'Absolutely perfect stay! The Ocean View Suite was breathtaking and the staff went above and beyond to make our anniversary special. The room was spotless and the amenities were top-notch.',
        createdAt: new Date('2026-04-20'),
        updatedAt: new Date('2026-04-20'),
      },
      {
        rating: 4,
        comment:
          'Great family room experience! The Family Room was spacious and perfect for our kids. Kids amenities were excellent. Only minor issue was the wait for room service, but overall very satisfied.',
        createdAt: new Date('2026-04-22'),
        updatedAt: new Date('2026-04-22'),
      },
      {
        rating: 5,
        comment:
          'Outstanding luxury experience! The Presidential Suite exceeded all expectations. Private elevator access, wine cellar, and rooftop terrace were incredible. Will definitely return for our next business trip.',
        createdAt: new Date('2026-04-24'),
        updatedAt: new Date('2026-04-24'),
      },
      {
        rating: 4,
        comment:
          'Beautiful Garden Cottage for our romantic getaway. The private garden and fireplace created the perfect atmosphere. Very peaceful and relaxing. Would have preferred more breakfast options though.',
        createdAt: new Date('2026-04-25'),
        updatedAt: new Date('2026-04-25'),
      },
      {
        rating: 5,
        comment:
          'Amazing Beach Bungalow experience! Direct beach access was fantastic and the hammock was so relaxing. The outdoor shower and BBQ grill added such a nice touch. Perfect for our summer vacation!',
        createdAt: new Date('2026-04-26'),
        updatedAt: new Date('2026-04-26'),
      },
    ];

    const reviewsToInsert = [];

    // 3. Safely map templates to existing bookings
    // This loops through the templates, but stops safely if we run out of bookings.
    for (let i = 0; i < reviewTemplates.length; i++) {
      if (i >= bookings.length) {
        break; // We have more review templates than actual bookings, stop here safely.
      }

      const booking = bookings[i];
      const template = reviewTemplates[i];

      reviewsToInsert.push({
        userId: booking.userId,     // Automatically uses the user who made the booking
        bookingId: booking.id,      // Automatically uses a valid booking ID
        rating: template.rating,
        comment: template.comment,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      });
    }

    if (reviewsToInsert.length > 0) {
      console.log(`[reviews seeder] Inserting ${reviewsToInsert.length} mapped reviews`);
      await queryInterface.bulkInsert('Reviews', reviewsToInsert);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};