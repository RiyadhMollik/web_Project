const API_BASE_URL = 'http://localhost:5000/api';

class AppointmentService {
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

    // Make public API request (no authentication required)
    async makePublicRequest(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
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

    // Book a new appointment
    async bookAppointment(appointmentData) {
        return this.makeRequest('/appointments/book', {
            method: 'POST',
            body: JSON.stringify(appointmentData),
        });
    }

    // Get user's appointments
    async getMyAppointments(status = null, page = 1, limit = 10) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status) {
            params.append('status', status);
        }

        return this.makeRequest(`/appointments/my-appointments?${params}`);
    }

    // Get appointment by ID
    async getAppointmentById(appointmentId) {
        return this.makeRequest(`/appointments/${appointmentId}`);
    }

    // Update appointment status (doctors/admins only)
    async updateAppointmentStatus(appointmentId, status) {
        return this.makeRequest(`/appointments/${appointmentId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Cancel appointment
    async cancelAppointment(appointmentId) {
        return this.makeRequest(`/appointments/${appointmentId}/cancel`, {
            method: 'PUT',
        });
    }

    // Get available time slots for a doctor on a specific date
    async getAvailableSlots(doctorId, date) {
        const params = new URLSearchParams({
            doctorId: doctorId.toString(),
            date: date,
        });

        return this.makeRequest(`/appointments/available-slots?${params}`);
    }

    // Get doctor schedules
    async getDoctorSchedules(doctorId) {
        return this.makePublicRequest(`/schedules/doctor/${doctorId}`);
    }

    // Get all doctors (for appointment booking)
    async getAllDoctors() {
        return this.makePublicRequest('/users/public/doctors');
    }

    // Get doctor details
    async getDoctorDetails(doctorId) {
        return this.makeRequest(`/appointments/doctor/${doctorId}/details`);
    }
}

export const appointmentService = new AppointmentService(); 