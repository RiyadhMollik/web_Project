const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const medicalReportController = require('../controllers/medicalReport.controller');
const { authenticateToken, requirePatient, requireDoctorOrAdmin } = require('../middleware/auth.middleware');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/medical-reports');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and image files are allowed.'), false);
    }
  }
});

// Medical report routes
router.post('/upload', authenticateToken, requirePatient, upload.single('medicalReport'), medicalReportController.uploadMedicalReport);
router.get('/my-reports', authenticateToken, requirePatient, medicalReportController.getMyMedicalReports);
router.get('/patient/:patientId', authenticateToken, requireDoctorOrAdmin, medicalReportController.getPatientMedicalReports);
router.get('/:id', authenticateToken, medicalReportController.getMedicalReportById);
router.put('/:id', authenticateToken, requirePatient, medicalReportController.updateMedicalReport);
router.delete('/:id', authenticateToken, requirePatient, medicalReportController.deleteMedicalReport);

// Download medical report file (with authentication)
router.get('/download/:filename', authenticateToken, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }
  
  res.download(filePath);
});

module.exports = router; 