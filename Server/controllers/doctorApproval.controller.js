const { DoctorApproval, User } = require('../models');
const { Op } = require('sequelize');

// Submit doctor approval request
const submitApprovalRequest = async (req, res) => {
  try {
    const { licenseNumber, specialization, experience, proofDocuments } = req.body;
    const userId = req.user.id;

    // Check if user is already a doctor
    const user = await User.findByPk(userId);
    if (user.role === 'doctor') {
      return res.status(400).json({ message: 'User is already a doctor' });
    }

    // Check if there's already a pending approval request
    const existingRequest = await DoctorApproval.findOne({
      where: { userId, status: 'pending' }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending approval request' });
    }

    // Create approval request
    const approvalRequest = await DoctorApproval.create({
      userId,
      licenseNumber,
      specialization,
      experience,
      proofDocuments,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Doctor approval request submitted successfully',
      approvalRequest
    });

  } catch (error) {
    console.error('Submit approval request error:', error);
    res.status(500).json({ message: 'Error submitting approval request' });
  }
};

// Get all pending approval requests (admin only)
const getPendingApprovals = async (req, res) => {
  try {
    const pendingApprovals = await DoctorApproval.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'address', 'dateOfBirth', 'gender']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ pendingApprovals });

  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ message: 'Error fetching pending approvals' });
  }
};

// Get approval request by ID
const getApprovalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const approval = await DoctorApproval.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'address', 'dateOfBirth', 'gender']
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!approval) {
      return res.status(404).json({ message: 'Approval request not found' });
    }

    res.json({ approval });

  } catch (error) {
    console.error('Get approval by ID error:', error);
    res.status(500).json({ message: 'Error fetching approval request' });
  }
};

// Approve or reject doctor request (admin only)
const updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const adminId = req.user.id;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
    }

    const approval = await DoctorApproval.findByPk(id);
    if (!approval) {
      return res.status(404).json({ message: 'Approval request not found' });
    }

    if (approval.status !== 'pending') {
      return res.status(400).json({ message: 'Approval request has already been processed' });
    }

    // Update approval status
    await approval.update({
      status,
      adminNotes,
      approvedBy: adminId,
      approvedAt: new Date()
    });

    // If approved, update user role to doctor
    if (status === 'approved') {
      const user = await User.findByPk(approval.userId);
      await user.update({
        role: 'doctor',
        specialization: approval.specialization,
        licenseNumber: approval.licenseNumber,
        experience: approval.experience
      });
    }

    res.json({
      message: `Doctor request ${status} successfully`,
      approval
    });

  } catch (error) {
    console.error('Update approval status error:', error);
    res.status(500).json({ message: 'Error updating approval status' });
  }
};

// Get user's approval request status
const getMyApprovalStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const approval = await DoctorApproval.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({ approval });

  } catch (error) {
    console.error('Get my approval status error:', error);
    res.status(500).json({ message: 'Error fetching approval status' });
  }
};

// Get all approval requests (admin only)
const getAllApprovals = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      whereClause.status = status;
    }

    const approvals = await DoctorApproval.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      approvals: approvals.rows,
      total: approvals.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(approvals.count / limit)
    });

  } catch (error) {
    console.error('Get all approvals error:', error);
    res.status(500).json({ message: 'Error fetching approvals' });
  }
};

module.exports = {
  submitApprovalRequest,
  getPendingApprovals,
  getApprovalById,
  updateApprovalStatus,
  getMyApprovalStatus,
  getAllApprovals
}; 