const API_BASE_URL = 'http://localhost:5000/api';

class DoctorApprovalService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Make authenticated request
  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Submit doctor approval request
  async submitApprovalRequest(approvalData) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/doctor-approvals/submit`, {
      method: 'POST',
      body: JSON.stringify(approvalData),
    });
  }

  // Get user's approval request status
  async getMyApprovalStatus() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/doctor-approvals/my-status`);
  }

  // Admin: Get all pending approval requests
  async getPendingApprovals() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/doctor-approvals/pending`);
  }

  // Admin: Get all approval requests with pagination and filtering
  async getAllApprovals(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${this.baseURL}/doctor-approvals?${queryParams}` : `${this.baseURL}/doctor-approvals`;
    return this.makeAuthenticatedRequest(url);
  }

  // Admin: Get specific approval request
  async getApprovalById(id) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/doctor-approvals/${id}`);
  }

  // Admin: Approve or reject doctor request
  async updateApprovalStatus(id, status, adminNotes = '') {
    return this.makeAuthenticatedRequest(`${this.baseURL}/doctor-approvals/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    });
  }
}

export const doctorApprovalService = new DoctorApprovalService(); 