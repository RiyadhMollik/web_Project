const API_BASE_URL = 'http://localhost:5000/api';

class DoctorScheduleService {
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

    // Get doctor's schedules
    async getMySchedules() {
        return this.makeRequest('/schedules/my-schedules');
    }

    // Create a new schedule
    async createSchedule(scheduleData) {
        return this.makeRequest('/schedules', {
            method: 'POST',
            body: JSON.stringify(scheduleData),
        });
    }

    // Update a schedule
    async updateSchedule(scheduleId, scheduleData) {
        return this.makeRequest(`/schedules/${scheduleId}`, {
            method: 'PUT',
            body: JSON.stringify(scheduleData),
        });
    }

    // Delete a schedule
    async deleteSchedule(scheduleId) {
        return this.makeRequest(`/schedules/${scheduleId}`, {
            method: 'DELETE',
        });
    }

    // Get schedules for a specific doctor (public)
    async getDoctorSchedules(doctorId) {
        return this.makeRequest(`/schedules/doctor/${doctorId}`);
    }
}

export const doctorScheduleService = new DoctorScheduleService(); 