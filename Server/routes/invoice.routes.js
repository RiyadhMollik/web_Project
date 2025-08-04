const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { authenticateToken, requirePatient, requireDoctorOrAdmin } = require('../middleware/auth.middleware');

// Generate invoice after appointment booking
router.post('/generate', authenticateToken, requirePatient, invoiceController.generateInvoice);

// Get invoices for the authenticated user
router.get('/my-invoices', authenticateToken, invoiceController.getInvoices);

// Get invoice by ID
router.get('/:id', authenticateToken, invoiceController.getInvoiceById);

// Update invoice status (mark as paid, etc.)
router.put('/:id/status', authenticateToken, invoiceController.updateInvoiceStatus);

// Get invoice by appointment ID
router.get('/appointment/:appointmentId', authenticateToken, invoiceController.getInvoiceByAppointment);

module.exports = router; 