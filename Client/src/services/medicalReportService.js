const API_BASE_URL = 'http://localhost:5000/api';

class MedicalReportService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Upload medical report
  async uploadMedicalReport(formData) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${this.baseURL}/medical-reports/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // Don't set Content-Type for FormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get my medical reports (for patients)
  async getMyMedicalReports() {
    return this.makeAuthenticatedRequest(`${this.baseURL}/medical-reports/my-reports`);
  }

  // Get patient's medical reports (for doctors/admins)
  async getPatientMedicalReports(patientId) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/medical-reports/patient/${patientId}`);
  }

  // Get single medical report
  async getMedicalReportById(id) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/medical-reports/${id}`);
  }

  // Update medical report
  async updateMedicalReport(id, reportData) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/medical-reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
  }

  // Delete medical report
  async deleteMedicalReport(id) {
    return this.makeAuthenticatedRequest(`${this.baseURL}/medical-reports/${id}`, {
      method: 'DELETE',
    });
  }

  // Download medical report file
  async downloadMedicalReport(filename) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${this.baseURL}/medical-reports/download/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return blob;
  }
}

export const medicalReportService = new MedicalReportService(); 