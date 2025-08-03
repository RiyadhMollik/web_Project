const express = require('express');
const router = express.Router();
const doctorApprovalController = require('../controllers/doctorApproval.controller');
const { authenticateToken, requireAdmin, requirePatient } = require('../middleware/auth.middleware');

// Submit doctor approval request (patients only)
router.post('/submit', authenticateToken, requirePatient, doctorApprovalController.submitApprovalRequest);

// Get user's approval request status
router.get('/my-status', authenticateToken, doctorApprovalController.getMyApprovalStatus);

// Admin routes
// Get all pending approval requests
router.get('/pending', authenticateToken, requireAdmin, doctorApprovalController.getPendingApprovals);

// Get all approval requests with pagination and filtering
router.get('/', authenticateToken, requireAdmin, doctorApprovalController.getAllApprovals);

// Get specific approval request
router.get('/:id', authenticateToken, requireAdmin, doctorApprovalController.getApprovalById);

// Approve or reject doctor request
router.put('/:id/status', authenticateToken, requireAdmin, doctorApprovalController.updateApprovalStatus);

module.exports = router; 