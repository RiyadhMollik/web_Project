const API_BASE_URL = 'http://localhost:5000/api';

class InvoiceService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getAuthToken() {
        return localStorage.getItem('token');
    }

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

    // Generate invoice after appointment booking
    async generateInvoice(appointmentId) {
        return this.makeRequest('/invoices/generate', {
            method: 'POST',
            body: JSON.stringify({ appointmentId }),
        });
    }

    // Get user's invoices
    async getMyInvoices(status = null, page = 1, limit = 10) {
        let endpoint = `/invoices/my-invoices?page=${page}&limit=${limit}`;
        if (status) {
            endpoint += `&status=${status}`;
        }
        return this.makeRequest(endpoint);
    }

    // Get invoice by ID
    async getInvoiceById(invoiceId) {
        return this.makeRequest(`/invoices/${invoiceId}`);
    }

    // Update invoice status
    async updateInvoiceStatus(invoiceId, status, paymentMethod = null) {
        const body = { status };
        if (paymentMethod) {
            body.paymentMethod = paymentMethod;
        }
        
        return this.makeRequest(`/invoices/${invoiceId}/status`, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    // Get invoice by appointment ID
    async getInvoiceByAppointment(appointmentId) {
        return this.makeRequest(`/invoices/appointment/${appointmentId}`);
    }
}

export const invoiceService = new InvoiceService(); 