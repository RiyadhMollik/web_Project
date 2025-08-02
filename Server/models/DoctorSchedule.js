const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DoctorSchedule = sequelize.define('DoctorSchedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    hospitalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hospitalAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dayOfWeek: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    consultationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    maxPatients: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  return DoctorSchedule;
}; 