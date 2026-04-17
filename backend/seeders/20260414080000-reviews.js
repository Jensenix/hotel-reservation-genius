'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing users and bookings
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" LIMIT 8`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const bookings = await queryInterface.sequelize.query(
      `SELECT b.id, b."userId", r."roomNumber" FROM "Bookings" b JOIN "Rooms" r ON b."roomId" = r.id WHERE b.status = 'checked_out' LIMIT 10`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || bookings.length === 0) {
      console.log('No users or checked-out bookings found, skipping reviews seeder');
      return;
    }

    console.log('Found users:', users.length);
    console.log('Found checked-out bookings:', bookings.length);

    // Create reviews - not for every booking
    const reviews = [];
    const usedBookingIds = new Set();
    
    // Only add reviews to some bookings (60% chance)
    bookings.forEach((booking, index) => {
      if (Math.random() > 0.4) { // 60% chance to have a review
        // Make sure we don't duplicate reviews for same booking
        if (!usedBookingIds.has(booking.id)) {
          usedBookingIds.add(booking.id);
          
          const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars (mostly positive)
          
          // Sample review comments based on rating
          let comment = '';
          if (rating === 5) {
            const comments = [
              'Excellent stay! Room was clean and staff was very helpful.',
              'Perfect hotel experience. Will definitely come back!',
              'Amazing service and beautiful room. Highly recommended!',
              'Outstanding hospitality. Everything exceeded expectations.'
            ];
            comment = comments[Math.floor(Math.random() * comments.length)];
          } else if (rating === 4) {
            const comments = [
              'Good experience overall. Room was comfortable.',
              'Nice hotel with friendly staff. Would stay again.',
              'Pleasant stay. Location is convenient.',
              'Good value for money. Room was clean.'
            ];
            comment = comments[Math.floor(Math.random() * comments.length)];
          } else {
            const comments = [
              'Average stay. Room was okay but could be better.',
              'Decent hotel but some areas need improvement.',
              'Room was clean but service was slow.',
              'Acceptable for the price. Nothing special.'
            ];
            comment = comments[Math.floor(Math.random() * comments.length)];
          }
          
          reviews.push({
            bookingId: booking.id,
            userId: booking.userId, // Use the actual booking user
            rating: rating,
            comment: comment,
            createdAt: new Date(), // Today's date
            updatedAt: new Date()
          });
        }
      }
    });

    if (reviews.length > 0) {
      console.log(`Inserting ${reviews.length} reviews`);
      await queryInterface.bulkInsert('Reviews', reviews);
    } else {
      console.log('No reviews created');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
