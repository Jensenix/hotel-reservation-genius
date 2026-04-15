const { sequelize, User } = require('./models');

async function checkAdminPassword() {
  try {
    console.log('Checking admin password...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection successful');
    
    // Find admin user
    const adminUser = await User.findOne({
      where: {
        email: 'admin@geniussocietyhotel.com'
      }
    });
    
    if (adminUser) {
      console.log('Admin user found:');
      console.log(`- ID: ${adminUser.id}`);
      console.log(`- Name: ${adminUser.fullName}`);
      console.log(`- Email: ${adminUser.email}`);
      console.log(`- Role: ${adminUser.role}`);
      console.log(`- Password: ${adminUser.password}`);
      console.log(`- Phone: ${adminUser.phoneNumber}`);
      
      // Also check all users for debugging
      console.log('\nAll users with passwords:');
      const allUsers = await User.findAll();
      allUsers.forEach(user => {
        console.log(`- ${user.fullName} (${user.email}) - Password: "${user.password}" - Role: ${user.role}`);
      });
      
    } else {
      console.log('Admin user not found!');
    }
    
  } catch (error) {
    console.error('Check failed:', error);
  } finally {
    await sequelize.close();
  }
}

checkAdminPassword();
