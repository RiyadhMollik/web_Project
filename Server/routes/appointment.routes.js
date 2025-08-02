const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticateToken, requirePatient, requireDoctorOrAdmin } = require('../middleware/auth.middleware');

// Book a new appointment (patients only)
router.post('/book', authenticateToken, requirePatient, appointmentController.bookAppointment);

// Get appointments for the authenticated user
router.get('/my-appointments', authenticateToken, appointmentController.getAppointments);

// Get appointment by ID (user can only access their own appointments)
router.get('/:id', authenticateToken, appointmentController.getAppointmentById);

// Update appointment status (doctors and admins only)
router.put('/:id/status', authenticateToken, requireDoctorOrAdmin, appointmentController.updateAppointmentStatus);

// Cancel appointment (patients can cancel their own, doctors can cancel their appointments)
router.put('/:id/cancel', authenticateToken, appointmentController.cancelAppointment);

// Get available time slots for a doctor on a specific date
router.get('/available-slots', appointmentController.getAvailableSlots);

// Get doctor schedules
router.get('/doctor/:doctorId/schedules', appointmentController.getDoctorSchedules);

module.exports = router;
