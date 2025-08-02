const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import and initialize models
const User = require('./User')(sequelize);
const Appointment = require('./Appointment')(sequelize);
const DoctorSchedule = require('./DoctorSchedule')(sequelize);
const Review = require('./Review')(sequelize);

const models = { User, Appointment, DoctorSchedule, Review };

// Define associations
User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'doctorAppointments', foreignKey: 'doctorId' });
User.hasMany(DoctorSchedule, { as: 'schedules', foreignKey: 'doctorId' });

Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
Appointment.belongsTo(DoctorSchedule, { as: 'schedule', foreignKey: 'scheduleId' });

DoctorSchedule.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

// Review associations
User.hasMany(Review, { foreignKey: 'patientId', as: 'patientReviews' });
User.hasMany(Review, { foreignKey: 'doctorId', as: 'doctorReviews' });
Review.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Review.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  models,
  syncDatabase,
  testConnection,
  User,
  Appointment,
  DoctorSchedule,
  Review
};
