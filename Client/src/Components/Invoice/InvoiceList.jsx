import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { invoiceService } from '../../services/invoiceService';
import { Download, Eye, CreditCard, Calendar, DollarSign } from 'lucide-react';

const InvoiceList = () => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInvoices();
    }
  }, [isAuthenticated, selectedStatus, currentPage]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getMyInvoices(selectedStatus || null, currentPage, 10);
      setInvoices(response.invoices || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      showError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (invoiceId, newStatus, paymentMethod = null) => {
    try {
      await invoiceService.updateInvoiceStatus(invoiceId, newStatus, paymentMethod);
      showSuccess(`Invoice status updated to ${newStatus}`);
      fetchInvoices(); // Refresh the list
    } catch (error) {
      console.error('Error updating invoice status:', error);
      showError('Failed to update invoice status');
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📄 My Invoices
          </h1>
          <p className="text-xl text-gray-600">
            Manage and view your medical appointment invoices
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Total: {invoices.length} invoices
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No invoices found</h3>
              <p className="text-gray-600">
                {selectedStatus ? `No ${selectedStatus} invoices available.` : 'You don\'t have any invoices yet.'}
              </p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Invoice #{invoice.invoiceNumber}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {formatDate(invoice.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Amount: {formatCurrency(invoice.totalAmount)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Dr. {invoice.appointment?.doctor?.name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    
                    {invoice.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(invoice.id, 'paid', 'cash')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                      >
                        <CreditCard className="w-4 h-4" />
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Invoice Detail Modal */}
        {showInvoiceModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Invoice #{selectedInvoice.invoiceNumber}
                    </h2>
                    <p className="text-gray-600">
                      Status: <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInvoice.status)}`}>
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Invoice Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Invoice Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Invoice Number:</span>
                        <p className="text-gray-900">{selectedInvoice.invoiceNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Issue Date:</span>
                        <p className="text-gray-900">{formatDate(selectedInvoice.createdAt)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Due Date:</span>
                        <p className="text-gray-900">{formatDate(selectedInvoice.dueDate)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <p className="text-gray-900">{selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}</p>
                      </div>
                      {selectedInvoice.paymentMethod && (
                        <div>
                          <span className="font-medium text-gray-700">Payment Method:</span>
                          <p className="text-gray-900">{selectedInvoice.paymentMethod}</p>
                        </div>
                      )}
                      {selectedInvoice.paymentDate && (
                        <div>
                          <span className="font-medium text-gray-700">Payment Date:</span>
                          <p className="text-gray-900">{formatDate(selectedInvoice.paymentDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Appointment Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Doctor:</span>
                        <p className="text-gray-900">Dr. {selectedInvoice.appointment?.doctor?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Specialization:</span>
                        <p className="text-gray-900">{selectedInvoice.appointment?.doctor?.specialization || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Date:</span>
                        <p className="text-gray-900">{selectedInvoice.appointment?.appointmentDate || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Time:</span>
                        <p className="text-gray-900">{selectedInvoice.appointment?.appointmentTime || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Hospital:</span>
                        <p className="text-gray-900">{selectedInvoice.appointment?.schedule?.hospitalName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Invoice Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Consultation Fee:</span>
                        <span>{formatCurrency(selectedInvoice.consultationFee)}</span>
                      </div>
                      {selectedInvoice.additionalCharges > 0 && (
                        <div className="flex justify-between">
                          <span>Additional Charges:</span>
                          <span>{formatCurrency(selectedInvoice.additionalCharges)}</span>
                        </div>
                      )}
                      {selectedInvoice.discount > 0 && (
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span>-{formatCurrency(selectedInvoice.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total Amount:</span>
                        <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                  {selectedInvoice.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedInvoice.id, 'paid', 'cash');
                        setShowInvoiceModal(false);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      <CreditCard className="w-4 h-4" />
                      Mark as Paid
                    </button>
                  )}
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList; 