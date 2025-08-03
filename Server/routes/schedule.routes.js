const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { authenticateToken, requireDoctor } = require('../middleware/auth.middleware');

// Doctor schedule management routes (doctors only)
router.get('/my-schedules', authenticateToken, requireDoctor, scheduleController.getMySchedules);
router.post('/', authenticateToken, requireDoctor, scheduleController.createSchedule);
router.put('/:id', authenticateToken, requireDoctor, scheduleController.updateSchedule);
router.delete('/:id', authenticateToken, requireDoctor, scheduleController.deleteSchedule);

// Public route to get doctor schedules (for appointment booking)
router.get('/doctor/:doctorId', scheduleController.getDoctorSchedules);

module.exports = router; 