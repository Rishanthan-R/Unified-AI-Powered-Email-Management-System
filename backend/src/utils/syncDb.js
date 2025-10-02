require('dotenv').config();
const { sequelize } = require('./config/database');
const models = require('./models');

const syncDatabase = async () => {
  try {
    console.log('Starting database synchronization...');
    
    await sequelize.authenticate();
    console.log('Database connection established');

    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synced successfully');

    process.exit(0);
  } catch (error) {
    console.error('Database sync failed:', error);
    process.exit(1);
  }
};

syncDatabase();
