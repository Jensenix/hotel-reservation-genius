'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing bookings and extra services
    const bookings = await queryInterface.sequelize.query(
      `SELECT b.id, r."roomNumber" FROM "Bookings" b JOIN "Rooms" r ON b."roomId" = r.id WHERE b.status IN ('confirmed', 'checked_in', 'checked_out') LIMIT 5`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const extraServices = await queryInterface.sequelize.query(
      `SELECT id, "serviceName", "price" FROM "ExtraServices" LIMIT 6`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (bookings.length === 0 || extraServices.length === 0) {
      console.log('No bookings or extra services found, skipping booking extra services seeder');
      return;
    }

    console.log('Found bookings:', bookings.length);
    console.log('Found extra services:', extraServices.length);

    // Create booking extra services - not for every booking
    const bookingExtraServices = [];
    
    // Only add extra services to some bookings (70% chance)
    bookings.forEach((booking, index) => {
      if (Math.random() > 0.3) { // 70% chance to have extra services
        // Add 1-3 extra services per booking
        const numServices = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numServices; i++) {
          const serviceIndex = Math.floor(Math.random() * extraServices.length);
          const service = extraServices[serviceIndex];
          
          bookingExtraServices.push({
            bookingId: booking.id,
            extraServiceId: service.id,
            quantity: Math.floor(Math.random() * 3) + 1, // 1-3 quantity
            subtotal: service.price,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    });

    if (bookingExtraServices.length > 0) {
      console.log(`Inserting ${bookingExtraServices.length} booking extra services`);
      await queryInterface.bulkInsert('BookingExtraServices', bookingExtraServices);
    } else {
      console.log('No booking extra services created');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('BookingExtraServices', null, {});
  }
};
