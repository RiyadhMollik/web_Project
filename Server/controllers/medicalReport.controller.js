const { MedicalReport, User } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Upload medical report
const uploadMedicalReport = async (req, res) => {
  try {
    const { patientId, reportType, reportTitle, reportDate, description } = req.body;
    const uploadedBy = req.user.id;

    // Validate required fields
    if (!patientId || !reportType || !reportTitle || !reportDate) {
      return res.status(400).json({
        message: 'Missing required fields: patientId, reportType, reportTitle, reportDate'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: 'Medical report file is required'
      });
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return res.status(400).json({
        message: 'Invalid file type. Only PDF and image files are allowed'
      });
    }

    // Create file URL (in production, this would be uploaded to cloud storage)
    const fileUrl = `/uploads/medical-reports/${req.file.filename}`;

    // Create medical report
    const medicalReport = await MedicalReport.create({
      patientId,
      reportType,
      reportTitle,
      reportDate,
      fileUrl,
      description,
      uploadedBy
    });

    res.status(201).json({
      message: 'Medical report uploaded successfully',
      medicalReport
    });

  } catch (error) {
    console.error('Error uploading medical report:', error);
    res.status(500).json({
      message: 'Failed to upload medical report',
      error: error.message
    });
  }
};

// Get patient's medical reports
const getPatientMedicalReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user.id;

    // Check if user is authorized to view these reports
    if (req.user.role !== 'admin' && req.user.role !== 'doctor' && userId != patientId) {
      return res.status(403).json({
        message: 'Unauthorized to view these medical reports'
      });
    }

    const reports = await MedicalReport.findAll({
      where: {
        patientId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Medical reports retrieved successfully',
      reports
    });

  } catch (error) {
    console.error('Error retrieving medical reports:', error);
    res.status(500).json({
      message: 'Failed to retrieve medical reports',
      error: error.message
    });
  }
};

// Get single medical report
const getMedicalReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const report = await MedicalReport.findOne({
      where: {
        id,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!report) {
      return res.status(404).json({
        message: 'Medical report not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && req.user.role !== 'doctor' && userId != report.patientId) {
      return res.status(403).json({
        message: 'Unauthorized to view this medical report'
      });
    }

    res.json({
      message: 'Medical report retrieved successfully',
      report
    });

  } catch (error) {
    console.error('Error retrieving medical report:', error);
    res.status(500).json({
      message: 'Failed to retrieve medical report',
      error: error.message
    });
  }
};

// Update medical report
const updateMedicalReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportType, reportTitle, reportDate, description } = req.body;
    const userId = req.user.id;

    const report = await MedicalReport.findByPk(id);

    if (!report) {
      return res.status(404).json({
        message: 'Medical report not found'
      });
    }

    // Check authorization (only patient who owns the report or admin can update)
    if (req.user.role !== 'admin' && userId != report.patientId) {
      return res.status(403).json({
        message: 'Unauthorized to update this medical report'
      });
    }

    // Update report
    await report.update({
      reportType,
      reportTitle,
      reportDate,
      description
    });

    res.json({
      message: 'Medical report updated successfully',
      report
    });

  } catch (error) {
    console.error('Error updating medical report:', error);
    res.status(500).json({
      message: 'Failed to update medical report',
      error: error.message
    });
  }
};

// Delete medical report (soft delete)
const deleteMedicalReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const report = await MedicalReport.findByPk(id);

    if (!report) {
      return res.status(404).json({
        message: 'Medical report not found'
      });
    }

    // Check authorization (only patient who owns the report or admin can delete)
    if (req.user.role !== 'admin' && userId != report.patientId) {
      return res.status(403).json({
        message: 'Unauthorized to delete this medical report'
      });
    }

    // Soft delete
    await report.update({ isActive: false });

    res.json({
      message: 'Medical report deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting medical report:', error);
    res.status(500).json({
      message: 'Failed to delete medical report',
      error: error.message
    });
  }
};

// Get my medical reports (for patients)
const getMyMedicalReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await MedicalReport.findAll({
      where: {
        patientId: userId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Medical reports retrieved successfully',
      reports
    });

  } catch (error) {
    console.error('Error retrieving medical reports:', error);
    res.status(500).json({
      message: 'Failed to retrieve medical reports',
      error: error.message
    });
  }
};

module.exports = {
  uploadMedicalReport,
  getPatientMedicalReports,
  getMedicalReportById,
  updateMedicalReport,
  deleteMedicalReport,
  getMyMedicalReports
}; 