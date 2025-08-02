const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const MedicalReport = sequelize.define('MedicalReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  reportType: {
    type: DataTypes.ENUM('blood_test', 'xray', 'mri', 'ct_scan', 'ultrasound', 'ecg', 'other'),
    allowNull: false
  },
  reportTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reportDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = MedicalReport; 