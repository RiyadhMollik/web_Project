const { DoctorSchedule, User } = require('../models');

// Get doctor's own schedules
const getMySchedules = async (req, res) => {
  try {
    const doctorId = req.user.id;
    
    const schedules = await DoctorSchedule.findAll({
      where: { doctorId, isActive: true },
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC']
      ]
    });

    res.json({
      success: true,
      message: 'Schedules retrieved successfully',
      schedules
    });

  } catch (error) {
    console.error('Get my schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message
    });
  }
};

// Create a new schedule
const createSchedule = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const {
      hospitalName,
      hospitalAddress,
      dayOfWeek,
      startTime,
      endTime,
      consultationFee,
      maxPatients
    } = req.body;

    // Validate required fields
    if (!hospitalName || !hospitalAddress || !dayOfWeek || !startTime || !endTime || !consultationFee) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate day of week
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(dayOfWeek.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day of week'
      });
    }

    // Validate time format and ensure end time is after start time
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Use HH:MM format (e.g., 09:00)'
      });
    }

    // Convert times to minutes for comparison
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

    if (endMinutes <= startMinutes) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Convert HH:MM to HH:MM:SS for database storage
    const startTimeDB = startTime + ':00';
    const endTimeDB = endTime + ':00';

    // Check for time conflicts
    const existingSchedule = await DoctorSchedule.findOne({
      where: {
        doctorId,
        dayOfWeek: dayOfWeek.toLowerCase(),
        isActive: true
      }
    });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: 'You already have a schedule for this day'
      });
    }

    // Create the schedule
    const schedule = await DoctorSchedule.create({
      doctorId,
      hospitalName,
      hospitalAddress,
      dayOfWeek: dayOfWeek.toLowerCase(),
      startTime: startTimeDB,
      endTime: endTimeDB,
      consultationFee: parseFloat(consultationFee),
      maxPatients: parseInt(maxPatients) || 20
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      schedule
    });

  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating schedule',
      error: error.message
    });
  }
};

// Update a schedule
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    const {
      hospitalName,
      hospitalAddress,
      dayOfWeek,
      startTime,
      endTime,
      consultationFee,
      maxPatients
    } = req.body;

    // Find the schedule
    const schedule = await DoctorSchedule.findOne({
      where: { id, doctorId, isActive: true }
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Validate day of week if provided
    if (dayOfWeek) {
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      if (!validDays.includes(dayOfWeek.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid day of week'
        });
      }

      // Check for time conflicts with other schedules
      const existingSchedule = await DoctorSchedule.findOne({
        where: {
          doctorId,
          dayOfWeek: dayOfWeek.toLowerCase(),
          isActive: true,
          id: { [require('sequelize').Op.ne]: id }
        }
      });

      if (existingSchedule) {
        return res.status(400).json({
          success: false,
          message: 'You already have a schedule for this day'
        });
      }
    }

    // Validate time format and ensure end time is after start time if times are provided
    let startTimeDB, endTimeDB;
    if (startTime || endTime) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      const finalStartTime = startTime || schedule.startTime.slice(0, 5); // Convert from HH:MM:SS to HH:MM
      const finalEndTime = endTime || schedule.endTime.slice(0, 5); // Convert from HH:MM:SS to HH:MM

      if (!timeRegex.test(finalStartTime) || !timeRegex.test(finalEndTime)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid time format. Use HH:MM format (e.g., 09:00)'
        });
      }

      // Convert times to minutes for comparison
      const startMinutes = parseInt(finalStartTime.split(':')[0]) * 60 + parseInt(finalStartTime.split(':')[1]);
      const endMinutes = parseInt(finalEndTime.split(':')[0]) * 60 + parseInt(finalEndTime.split(':')[1]);

      if (endMinutes <= startMinutes) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time'
        });
      }

      // Convert HH:MM to HH:MM:SS for database storage
      startTimeDB = (startTime || schedule.startTime.slice(0, 5)) + ':00';
      endTimeDB = (endTime || schedule.endTime.slice(0, 5)) + ':00';
    }

    // Update the schedule
    await schedule.update({
      hospitalName: hospitalName || schedule.hospitalName,
      hospitalAddress: hospitalAddress || schedule.hospitalAddress,
      dayOfWeek: dayOfWeek ? dayOfWeek.toLowerCase() : schedule.dayOfWeek,
      startTime: startTimeDB || schedule.startTime,
      endTime: endTimeDB || schedule.endTime,
      consultationFee: consultationFee ? parseFloat(consultationFee) : schedule.consultationFee,
      maxPatients: maxPatients ? parseInt(maxPatients) : schedule.maxPatients
    });

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      schedule
    });

  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule',
      error: error.message
    });
  }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    // Find the schedule
    const schedule = await DoctorSchedule.findOne({
      where: { id, doctorId, isActive: true }
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Soft delete
    await schedule.update({ isActive: false });

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });

  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting schedule',
      error: error.message
    });
  }
};

// Get schedules for a specific doctor (public)
const getDoctorSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check if doctor exists
    const doctor = await User.findOne({
      where: { id: doctorId, role: 'doctor', isActive: true }
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const schedules = await DoctorSchedule.findAll({
      where: { doctorId, isActive: true },
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC']
      ]
    });

    res.json({
      success: true,
      message: 'Doctor schedules retrieved successfully',
      schedules
    });

  } catch (error) {
    console.error('Get doctor schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor schedules',
      error: error.message
    });
  }
};

module.exports = {
  getMySchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getDoctorSchedules
}; 