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
const Invoice = require('./Invoice')(sequelize);
const DoctorApproval = require('./DoctorApproval')(sequelize);

// Import additional models (these will be properly initialized later)
let Prescription;
const MedicalReport = require('./MedicalReport')(sequelize);

const models = { User, Appointment, DoctorSchedule, Review, Invoice, DoctorApproval, MedicalReport };

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

// Invoice associations
User.hasMany(Invoice, { foreignKey: 'patientId', as: 'patientInvoices' });
User.hasMany(Invoice, { foreignKey: 'doctorId', as: 'doctorInvoices' });
Invoice.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Invoice.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
Invoice.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
Appointment.hasOne(Invoice, { foreignKey: 'appointmentId', as: 'invoice' });

// DoctorApproval associations
User.hasMany(DoctorApproval, { foreignKey: 'userId', as: 'approvalRequests' });
User.hasMany(DoctorApproval, { foreignKey: 'approvedBy', as: 'approvedRequests' });
DoctorApproval.belongsTo(User, { foreignKey: 'userId', as: 'user' });
DoctorApproval.belongsTo(User, { foreignKey: 'approvedBy', as: 'admin' });

// MedicalReport associations
User.hasMany(MedicalReport, { foreignKey: 'patientId', as: 'medicalReports' });
User.hasMany(MedicalReport, { foreignKey: 'uploadedBy', as: 'uploadedReports' });
MedicalReport.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
MedicalReport.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// Sync database - use force: false to prevent "Too many keys" error
const syncDatabase = async () => {
  try {
    // Only sync the main models for now to avoid the key limit issue
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    // If sync fails, try to continue without syncing
    console.log('Continuing without database sync...');
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
  Review,
  Invoice,
  DoctorApproval,
  MedicalReport
};
