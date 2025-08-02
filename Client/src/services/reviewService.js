const API_BASE_URL = 'http://localhost:5000/api';

class ReviewService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get auth token from localStorage
    getAuthToken() {
        return localStorage.getItem('token');
    }

    // Make authenticated API request
    async makeRequest(endpoint, options = {}) {
        const token = this.getAuthToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(`${this.baseURL}${endpoint}`, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Add a new review
    async addReview(doctorId, rating, comment) {
        return this.makeRequest('/reviews/add', {
            method: 'POST',
            body: JSON.stringify({ doctorId, rating, comment }),
        });
    }

    // Get reviews for a specific doctor
    async getDoctorReviews(doctorId, page = 1, limit = 10) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        return this.makeRequest(`/reviews/doctor/${doctorId}?${params}`);
    }

    // Update a review
    async updateReview(reviewId, rating, comment) {
        return this.makeRequest(`/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify({ rating, comment }),
        });
    }

    // Delete a review
    async deleteReview(reviewId) {
        return this.makeRequest(`/reviews/${reviewId}`, {
            method: 'DELETE',
        });
    }

    // Get patient's reviews
    async getMyReviews(page = 1, limit = 10) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        return this.makeRequest(`/reviews/my-reviews?${params}`);
    }
}

export const reviewService = new ReviewService(); 