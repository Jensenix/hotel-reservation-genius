const { sequelize, User } = require('./models');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
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
      console.log(`- Phone: ${adminUser.phoneNumber}`);
      
      // Test login data structure
      const loginData = {
        id: adminUser.id,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
        phoneNumber: adminUser.phoneNumber
      };
      
      console.log('\nLogin data for frontend:');
      console.log(JSON.stringify(loginData, null, 2));
      
    } else {
      console.log('Admin user not found!');
      
      // Find all users to debug
      const allUsers = await User.findAll();
      console.log('\nAll users in database:');
      allUsers.forEach(user => {
        console.log(`- ${user.fullName} (${user.email}) - Role: ${user.role}`);
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testAdminLogin();
