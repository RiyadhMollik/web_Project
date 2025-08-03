const { Invoice, Appointment, User, DoctorSchedule } = require('../models');
const { Op } = require('sequelize');

// Generate invoice after appointment booking
const generateInvoice = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Find the appointment with related data
        const appointment = await Appointment.findByPk(appointmentId, {
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

        // Check if invoice already exists for this appointment
        const existingInvoice = await Invoice.findOne({
            where: { appointmentId }
        });

        if (existingInvoice) {
            return res.status(409).json({ message: 'Invoice already exists for this appointment' });
        }

        // Generate unique invoice number
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Calculate due date (7 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        // Create invoice
        const invoice = await Invoice.create({
            appointmentId: appointment.id,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            invoiceNumber,
            consultationFee: appointment.consultationFee,
            additionalCharges: 0.00,
            discount: 0.00,
            totalAmount: appointment.consultationFee,
            currency: 'USD',
            status: 'pending',
            dueDate: dueDate.toISOString().split('T')[0],
            notes: `Invoice for appointment on ${appointment.appointmentDate} at ${appointment.appointmentTime}`
        });

        // Get invoice with related data
        const invoiceWithDetails = await Invoice.findByPk(invoice.id, {
            include: [
                {
                    model: Appointment,
                    as: 'appointment',
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
                            attributes: ['hospitalName', 'hospitalAddress']
                        }
                    ]
                }
            ]
        });

        res.status(201).json({
            message: 'Invoice generated successfully',
            invoice: invoiceWithDetails
        });

    } catch (error) {
        console.error('Generate invoice error:', error);
        res.status(500).json({ message: 'Error generating invoice' });
    }
};

// Get invoices for a user (patient or doctor)
const getInvoices = async (req, res) => {
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
        if (status && ['pending', 'paid', 'cancelled', 'refunded'].includes(status)) {
            whereClause.status = status;
        }

        const invoices = await Invoice.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Appointment,
                    as: 'appointment',
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
                            attributes: ['hospitalName', 'hospitalAddress']
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            invoices: invoices.rows,
            total: invoices.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(invoices.count / limit)
        });

    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ message: 'Error fetching invoices' });
    }
};

// Get invoice by ID
const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        let whereClause = { id };

        // Ensure users can only access their own invoices
        if (userRole === 'patient') {
            whereClause.patientId = userId;
        } else if (userRole === 'doctor') {
            whereClause.doctorId = userId;
        }

        const invoice = await Invoice.findOne({
            where: whereClause,
            include: [
                {
                    model: Appointment,
                    as: 'appointment',
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
                            attributes: ['hospitalName', 'hospitalAddress']
                        }
                    ]
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ invoice });

    } catch (error) {
        console.error('Get invoice by ID error:', error);
        res.status(500).json({ message: 'Error fetching invoice' });
    }
};

// Update invoice status (mark as paid, etc.)
const updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentMethod } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const validStatuses = ['pending', 'paid', 'cancelled', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Ensure users can only update their own invoices
        if (userRole === 'patient' && invoice.patientId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this invoice' });
        }

        if (userRole === 'doctor' && invoice.doctorId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this invoice' });
        }

        const updateData = { status };
        
        // If marking as paid, add payment details
        if (status === 'paid') {
            updateData.paymentMethod = paymentMethod || 'cash';
            updateData.paymentDate = new Date();
        }

        await invoice.update(updateData);

        res.json({
            message: 'Invoice status updated successfully',
            invoice
        });

    } catch (error) {
        console.error('Update invoice status error:', error);
        res.status(500).json({ message: 'Error updating invoice status' });
    }
};

// Get invoice by appointment ID
const getInvoiceByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        let whereClause = { appointmentId };

        // Ensure users can only access their own invoices
        if (userRole === 'patient') {
            whereClause.patientId = userId;
        } else if (userRole === 'doctor') {
            whereClause.doctorId = userId;
        }

        const invoice = await Invoice.findOne({
            where: whereClause,
            include: [
                {
                    model: Appointment,
                    as: 'appointment',
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
                            attributes: ['hospitalName', 'hospitalAddress']
                        }
                    ]
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found for this appointment' });
        }

        res.json({ invoice });

    } catch (error) {
        console.error('Get invoice by appointment error:', error);
        res.status(500).json({ message: 'Error fetching invoice' });
    }
};

module.exports = {
    generateInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoiceStatus,
    getInvoiceByAppointment
}; 