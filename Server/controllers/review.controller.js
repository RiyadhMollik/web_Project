const { Review, User } = require('../models');

// Add a new review
const addReview = async (req, res) => {
    try {
        const { doctorId, rating, comment } = req.body;
        const patientId = req.user.id;

        // Validate input
        if (!doctorId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'doctorId, rating, and comment are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if doctor exists
        const doctor = await User.findOne({
            where: { id: doctorId, role: 'doctor', isActive: true }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check if patient has already reviewed this doctor
        const existingReview = await Review.findOne({
            where: { patientId, doctorId, isActive: true }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this doctor'
            });
        }

        // Create new review
        const review = await Review.create({
            patientId,
            doctorId,
            rating,
            comment
        });

        // Fetch the created review with patient details
        const reviewWithPatient = await Review.findOne({
            where: { id: review.id },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review: reviewWithPatient
        });

    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
};

// Get reviews for a specific doctor
const getDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Check if doctor exists
        const doctor = await User.findOne({
            where: { id: doctorId, role: 'doctor', isActive: true }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Get reviews with pagination
        const reviews = await Review.findAndCountAll({
            where: { doctorId, isActive: true },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        // Calculate average rating
        const avgRating = await Review.findOne({
            where: { doctorId, isActive: true },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ]
        });

        res.json({
            success: true,
            message: 'Reviews retrieved successfully',
            reviews: reviews.rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(reviews.count / limit),
                totalReviews: reviews.count,
                hasNext: page * limit < reviews.count,
                hasPrev: page > 1
            },
            statistics: {
                averageRating: parseFloat(avgRating?.dataValues?.averageRating || 0).toFixed(1),
                totalReviews: parseInt(avgRating?.dataValues?.totalReviews || 0)
            }
        });

    } catch (error) {
        console.error('Get doctor reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

// Update a review (only by the patient who created it)
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const patientId = req.user.id;

        // Validate input
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'rating and comment are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Find the review
        const review = await Review.findOne({
            where: { id: reviewId, patientId, isActive: true }
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or you are not authorized to update it'
            });
        }

        // Update the review
        await review.update({ rating, comment });

        // Fetch updated review with patient details
        const updatedReview = await Review.findOne({
            where: { id: reviewId },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name']
                }
            ]
        });

        res.json({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview
        });

    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
};

// Delete a review (only by the patient who created it)
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const patientId = req.user.id;

        // Find the review
        const review = await Review.findOne({
            where: { id: reviewId, patientId, isActive: true }
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or you are not authorized to delete it'
            });
        }

        // Soft delete the review
        await review.update({ isActive: false });

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};

// Get all reviews for a patient
const getPatientReviews = async (req, res) => {
    try {
        const patientId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const reviews = await Review.findAndCountAll({
            where: { patientId, isActive: true },
            include: [
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name', 'specialization']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            message: 'Patient reviews retrieved successfully',
            reviews: reviews.rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(reviews.count / limit),
                totalReviews: reviews.count,
                hasNext: page * limit < reviews.count,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get patient reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient reviews',
            error: error.message
        });
    }
};

module.exports = {
    addReview,
    getDoctorReviews,
    updateReview,
    deleteReview,
    getPatientReviews
}; 