'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Manual review data with realistic content
    const reviews = [
      {
        userId: 1, // First user
        bookingId: 1, // First booking
        rating: 5,
        comment: 'Absolutely perfect stay! The Ocean View Suite was breathtaking and the staff went above and beyond to make our anniversary special. The room was spotless and the amenities were top-notch.',
        createdAt: new Date('2026-04-20'),
        updatedAt: new Date('2026-04-20')
      },
      {
        userId: 2, // Second user  
        bookingId: 2, // Second booking
        rating: 4,
        comment: 'Great family room experience! The Family Room was spacious and perfect for our kids. Kids amenities were excellent. Only minor issue was the wait for room service, but overall very satisfied.',
        createdAt: new Date('2026-04-22'),
        updatedAt: new Date('2026-04-22')
      },
      {
        userId: 3, // Third user
        bookingId: 3, // Third booking  
        rating: 5,
        comment: 'Outstanding luxury experience! The Presidential Suite exceeded all expectations. Private elevator access, wine cellar, and rooftop terrace were incredible. Will definitely return for our next business trip.',
        createdAt: new Date('2026-04-24'),
        updatedAt: new Date('2026-04-24')
      },
      {
        userId: 1, // First user again
        bookingId: 4, // Fourth booking
        rating: 4,
        comment: 'Beautiful Garden Cottage for our romantic getaway. The private garden and fireplace created the perfect atmosphere. Very peaceful and relaxing. Would have preferred more breakfast options though.',
        createdAt: new Date('2026-04-25'),
        updatedAt: new Date('2026-04-25')
      },
      {
        userId: 2, // Second user again
        bookingId: 5, // Fifth booking
        rating: 5,
        comment: 'Amazing Beach Bungalow experience! Direct beach access was fantastic and the hammock was so relaxing. The outdoor shower and BBQ grill added such a nice touch. Perfect for our summer vacation!',
        createdAt: new Date('2026-04-26'),
        updatedAt: new Date('2026-04-26')
      }
    ];

    console.log(`Inserting ${reviews.length} manual reviews`);
    await queryInterface.bulkInsert('Reviews', reviews);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
