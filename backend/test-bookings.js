const { sequelize, Booking, User, Room, RoomType } = require('./models');

async function testBookings() {
  try {
    console.log('Testing database connections...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection successful');
    
    // Check if there are any bookings
    const bookingCount = await Booking.count();
    console.log(`Total bookings: ${bookingCount}`);
    
    // Check if there are any users
    const userCount = await User.count();
    console.log(`Total users: ${userCount}`);
    
    // Check if there are any rooms
    const roomCount = await Room.count();
    console.log(`Total rooms: ${roomCount}`);
    
    // Check if there are any room types
    const roomTypeCount = await RoomType.count();
    console.log(`Total room types: ${roomTypeCount}`);
    
    // Get some sample data
    if (bookingCount > 0) {
      const bookings = await Booking.findAll({
        include: [
          { model: User, as: 'user' },
          { model: Room, as: 'room' }
        ],
        limit: 3
      });
      
      console.log('Sample bookings:');
      bookings.forEach(booking => {
        console.log(`Booking #${booking.id}: User=${booking.user?.fullName}, Room=${booking.room?.roomNumber}, Status=${booking.status}`);
      });
    }
    
    // Get users
    if (userCount > 0) {
      const users = await User.findAll({ limit: 3 });
      console.log('Sample users:');
      users.forEach(user => {
        console.log(`User: ${user.fullName} (${user.email})`);
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testBookings();
