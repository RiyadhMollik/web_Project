const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticateToken, requirePatient } = require('../middleware/auth.middleware');

// Add a new review (patients only)
router.post('/add', authenticateToken, requirePatient, reviewController.addReview);

// Get reviews for a specific doctor (public)
router.get('/doctor/:doctorId', reviewController.getDoctorReviews);

// Update a review (only by the patient who created it)
router.put('/:reviewId', authenticateToken, requirePatient, reviewController.updateReview);

// Delete a review (only by the patient who created it)
router.delete('/:reviewId', authenticateToken, requirePatient, reviewController.deleteReview);

// Get all reviews for the authenticated patient
router.get('/my-reviews', authenticateToken, requirePatient, reviewController.getPatientReviews);

module.exports = router; 