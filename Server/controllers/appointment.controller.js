const { Appointment, User, DoctorSchedule } = require('../models');
const { Op } = require('sequelize');

// Book a new appointment
const bookAppointment = async (req, res) => {
    try {
        const {
            doctorId,
            scheduleId,
            appointmentDate,
            appointmentTime,
            symptoms,
            notes
        } = req.body;

        const patientId = req.user.id; // Get from authenticated user

        // Validate required fields
        if (!doctorId || !scheduleId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                message: 'Missing required fields: doctorId, scheduleId, appointmentDate, appointmentTime'
            });
        }

        // Check if doctor exists and is a doctor
        const doctor = await User.findOne({
            where: { id: doctorId, role: 'doctor', isActive: true }
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or inactive' });
        }

        // Check if schedule exists and is active
        const schedule = await DoctorSchedule.findOne({
            where: {
                id: scheduleId,
                doctorId: doctorId,
                isActive: true
            }
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found or inactive' });
        }

        // Check if appointment date is valid (not in the past)
        const appointmentDateTime = new Date(`${appointmentDate} ${appointmentTime}`);
        const now = new Date();

        if (appointmentDateTime <= now) {
            return res.status(400).json({ message: 'Appointment date and time must be in the future' });
        }

        // Check if the appointment time falls within the schedule
        const appointmentDay = appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (appointmentDay !== schedule.dayOfWeek) {
            return res.status(400).json({
                message: `Appointment must be on ${schedule.dayOfWeek}`
            });
        }

        // Check if appointment time is within schedule hours
        const appointmentTimeStr = appointmentTime;
        if (appointmentTimeStr < schedule.startTime || appointmentTimeStr > schedule.endTime) {
            return res.status(400).json({
                message: `Appointment time must be between ${schedule.startTime} and ${schedule.endTime}`
            });
        }

        // Check for existing appointments at the same time
        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId,
                appointmentDate,
                appointmentTime,
                status: {
                    [Op.in]: ['scheduled', 'confirmed']
                }
            }
        });

        if (existingAppointment) {
            return res.status(409).json({
                message: 'This time slot is already booked. Please choose another time.'
            });
        }

        // Check if patient already has an appointment with this doctor on the same date
        const existingPatientAppointment = await Appointment.findOne({
            where: {
                patientId,
                doctorId,
                appointmentDate,
                status: {
                    [Op.in]: ['scheduled', 'confirmed']
                }
            }
        });

        if (existingPatientAppointment) {
            return res.status(409).json({
                message: 'You already have an appointment with this doctor on this date'
            });
        }

        // Create the appointment
        const appointment = await Appointment.create({
            patientId,
            doctorId,
            scheduleId,
            appointmentDate,
            appointmentTime,
            symptoms: symptoms || null,
            notes: notes || null,
            consultationFee: schedule.consultationFee,
            status: 'scheduled',
            paymentStatus: 'pending'
        });

        // Get appointment with related data
        const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name', 'email', 'specialization']
                },
                {
                    model: DoctorSchedule,
                    as: 'schedule',
                    attributes: ['hospitalName', 'hospitalAddress', 'consultationFee']
                }
            ]
        });

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: appointmentWithDetails
        });

    } catch (error) {
        console.error('Book appointment error:', error);
        res.status(500).json({ message: 'Error booking appointment' });
    }
};

// Get appointments for a user (patient or doctor)
const getAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const userId = req.user.id;
        const userRole = req.user.role;

        const offset = (page - 1) * limit;
        let whereClause = {};

        // Filter by user role
        if (userRole === 'patient') {
            whereClause.patientId = userId;
        } else if (userRole === 'doctor') {
            whereClause.doctorId = userId;
        }

        // Filter by status
        if (status && ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'].includes(status)) {
            whereClause.status = status;
        }

        const appointments = await Appointment.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name', 'email', 'specialization']
                },
                {
                    model: DoctorSchedule,
                    as: 'schedule',
                    attributes: ['hospitalName', 'hospitalAddress', 'consultationFee']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
        });

        res.json({
            appointments: appointments.rows,
            total: appointments.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(appointments.count / limit)
        });

    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        let whereClause = { id };

        // Ensure users can only access their own appointments
        if (userRole === 'patient') {
            whereClause.patientId = userId;
        } else if (userRole === 'doctor') {
            whereClause.doctorId = userId;
        }

        const appointment = await Appointment.findOne({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name', 'email', 'specialization']
                },
                {
                    model: DoctorSchedule,
                    as: 'schedule',
                    attributes: ['hospitalName', 'hospitalAddress', 'consultationFee']
                }
            ]
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ appointment });

    } catch (error) {
        console.error('Get appointment by ID error:', error);
        res.status(500).json({ message: 'Error fetching appointment' });
    }
};

// Update appointment status (doctor or admin only)
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userRole = req.user.role;

        // Only doctors and admins can update appointment status
        if (userRole !== 'doctor' && userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to update appointment status' });
        }

        const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Ensure doctors can only update their own appointments
        if (userRole === 'doctor' && appointment.doctorId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this appointment' });
        }

        await appointment.update({ status });

        res.json({
            message: 'Appointment status updated successfully',
            appointment
        });

    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({ message: 'Error updating appointment status' });
    }
};

// Cancel appointment (patient can cancel their own appointments)
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user can cancel this appointment
        if (userRole === 'patient' && appointment.patientId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to cancel this appointment' });
        }

        if (userRole === 'doctor' && appointment.doctorId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to cancel this appointment' });
        }

        // Check if appointment can be cancelled
        if (appointment.status === 'completed' || appointment.status === 'cancelled') {
            return res.status(400).json({ message: 'Appointment cannot be cancelled' });
        }

        await appointment.update({ status: 'cancelled' });

        res.json({
            message: 'Appointment cancelled successfully',
            appointment
        });

    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ message: 'Error cancelling appointment' });
    }
};

// Get available time slots for a doctor on a specific date
const getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        console.log('doctorId', doctorId);
        console.log('date', date);
        if (!doctorId || !date) {
            return res.status(400).json({ message: 'doctorId and date are required' });
        }

        // Get doctor's schedules for the day of week
        const appointmentDate = new Date(date);
        const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        console.log('Looking for schedules on:', dayOfWeek, 'for doctor:', doctorId);

        const schedules = await DoctorSchedule.findAll({
            where: {
                doctorId,
                dayOfWeek,
                isActive: true
            }
        });

        console.log('Found schedules:', schedules.length);

        if (schedules.length === 0) {
            return res.json({ availableSlots: [] });
        }

        // Get booked appointments for the date
        const bookedAppointments = await Appointment.findAll({
            where: {
                doctorId,
                appointmentDate: date,
                status: {
                    [Op.in]: ['scheduled', 'confirmed']
                }
            },
            attributes: ['appointmentTime']
        });

        const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);

        // Generate available time slots
        const availableSlots = [];

        schedules.forEach(schedule => {
            console.log('Processing schedule:', schedule.hospitalName, schedule.startTime, schedule.endTime);

            // Convert TIME format (HH:MM:SS) to HH:MM for processing
            const startTimeStr = schedule.startTime.slice(0, 5); // Take only HH:MM
            const endTimeStr = schedule.endTime.slice(0, 5); // Take only HH:MM

            const startTime = new Date(`2000-01-01 ${startTimeStr}`);
            const endTime = new Date(`2000-01-01 ${endTimeStr}`);

            // Skip invalid schedules where end time is before or equal to start time
            if (endTime <= startTime) {
                console.log('Skipping invalid schedule:', schedule.id, 'end time <= start time');
                return;
            }

            // Generate 30-minute slots
            const slotDuration = 30; // minutes
            let currentTime = new Date(startTime);

            while (currentTime < endTime) {
                const timeSlot = currentTime.toTimeString().slice(0, 5);

                if (!bookedTimes.includes(timeSlot)) {
                    availableSlots.push({
                        time: timeSlot,
                        scheduleId: schedule.id,
                        hospitalName: schedule.hospitalName,
                        consultationFee: schedule.consultationFee
                    });
                }

                currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
            }
        });

        console.log('Generated slots:', availableSlots.length);
        res.json({ availableSlots });

    } catch (error) {
        console.error('Get available slots error:', error);
        res.status(500).json({ message: 'Error fetching available slots' });
    }
};

// Get doctor schedules
const getDoctorSchedules = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const schedules = await DoctorSchedule.findAll({
            where: {
                doctorId,
                isActive: true
            },
            order: [
                ['dayOfWeek', 'ASC'],
                ['startTime', 'ASC']
            ]
        });

        res.json({ schedules });

    } catch (error) {
        console.error('Get doctor schedules error:', error);
        res.status(500).json({ message: 'Error fetching doctor schedules' });
    }
};

// Get doctor details by ID
const getDoctorDetails = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await User.findOne({
            where: {
                id: doctorId,
                role: 'doctor',
                isActive: true
            },
            attributes: [
                'id', 'name', 'email', 'phone', 'address', 'dateOfBirth',
                'gender', 'specialization', 'licenseNumber', 'experience'
            ]
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            message: 'Doctor details retrieved successfully',
            user: doctor
        });

    } catch (error) {
        console.error('Error getting doctor details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get doctor details',
            error: error.message
        });
    }
};

module.exports = {
    bookAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment,
    getAvailableSlots,
    getDoctorSchedules,
    getDoctorDetails
}; 