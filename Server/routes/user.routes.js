const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, requireAdmin, requireDoctorOrAdmin } = require('../middleware/auth.middleware');

// Admin only routes
router.get('/all', authenticateToken, requireAdmin, userController.getAllUsers);
router.get('/stats', authenticateToken, requireAdmin, userController.getDashboardStats);
router.get('/:id', authenticateToken, requireAdmin, userController.getUserById);
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);
router.post('/:id/reactivate', authenticateToken, requireAdmin, userController.reactivateUser);

// Routes accessible by admin and doctor
router.get('/role/:role', authenticateToken, requireDoctorOrAdmin, userController.getUsersByRole);

module.exports = router; 