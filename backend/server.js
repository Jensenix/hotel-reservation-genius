const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

// Sync database and start server
sequelize.sync({ alter: false }).then(() => {
  console.log('Database synced successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});
