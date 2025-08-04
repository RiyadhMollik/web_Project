import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { doctorApprovalService } from '../../services/doctorApprovalService';
import { Eye, CheckCircle, XCircle, Clock, FileText, User, Calendar } from 'lucide-react';

const DoctorApprovalManager = () => {
  const { showSuccess, showError } = useToast();
  const [approvals, setApprovals] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 0
  });

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'pending') {
        const response = await doctorApprovalService.getPendingApprovals();
        setPendingApprovals(response.pendingApprovals || []);
      } else {
        const response = await doctorApprovalService.getAllApprovals(filters);
        setApprovals(response.approvals || []);
        setPagination({
          total: response.total,
          currentPage: response.currentPage,
          totalPages: response.totalPages
        });
      }
    } catch (error) {
      showError('Failed to load approval requests');
      console.error('Error loading approvals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (approvalId) => {
    try {
      const response = await doctorApprovalService.getApprovalById(approvalId);
      setSelectedApproval(response.approval);
      setShowModal(true);
    } catch (error) {
      showError('Failed to load approval details');
    }
  };

  const handleApprovalAction = async (approvalId, status, adminNotes = '') => {
    setActionLoading(true);
    try {
      await doctorApprovalService.updateApprovalStatus(approvalId, status, adminNotes);
      showSuccess(`Approval request ${status} successfully`);
      setShowModal(false);
      setSelectedApproval(null);
      loadData(); // Refresh the data
    } catch (error) {
      showError(error.message || 'Failed to update approval status');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderApprovalCard = (approval) => (
    <div key={approval.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <User className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{approval.user?.name}</h3>
            <p className="text-sm text-gray-600">{approval.user?.email}</p>
          </div>
        </div>
        {getStatusBadge(approval.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">License Number</p>
          <p className="text-gray-800">{approval.licenseNumber}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Specialization</p>
          <p className="text-gray-800">{approval.specialization}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Experience</p>
          <p className="text-gray-800">{approval.experience} years</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          Submitted: {new Date(approval.createdAt).toLocaleDateString()}
        </div>
        <button
          onClick={() => handleViewDetails(approval.id)}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );

  const renderApprovalModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Approval Request Details</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {selectedApproval && (
            <div className="space-y-6">
              {/* User Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Applicant Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-gray-800">{selectedApproval.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-800">{selectedApproval.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-gray-800">{selectedApproval.user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-gray-800">{selectedApproval.user?.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">License Number</p>
                    <p className="text-gray-800">{selectedApproval.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Specialization</p>
                    <p className="text-gray-800">{selectedApproval.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Experience</p>
                    <p className="text-gray-800">{selectedApproval.experience} years</p>
                  </div>
                </div>
              </div>

              {/* Proof Documents */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Proof Documents</h3>
                <div className="space-y-2">
                  {selectedApproval.proofDocuments && selectedApproval.proofDocuments.length > 0 ? (
                    selectedApproval.proofDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center p-2 bg-white rounded border">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No documents uploaded</p>
                  )}
                </div>
              </div>

              {/* Admin Notes (if already processed) */}
              {selectedApproval.adminNotes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Admin Notes</h3>
                  <p className="text-gray-700">{selectedApproval.adminNotes}</p>
                </div>
              )}

              {/* Action Buttons (only for pending requests) */}
              {selectedApproval.status === 'pending' && (
                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    onClick={() => handleApprovalAction(selectedApproval.id, 'approved')}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-green-400"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt('Please provide a reason for rejection:');
                      if (notes !== null) {
                        handleApprovalAction(selectedApproval.id, 'rejected', notes);
                      }
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 disabled:bg-red-400"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Doctor Approval Management</h1>
        <p className="text-gray-600">Review and manage doctor approval requests</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
            activeTab === 'pending'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Pending Requests ({pendingApprovals.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
            activeTab === 'all'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Requests ({pagination.total})
        </button>
      </div>

      {/* Filters for All Requests */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'pending' ? (
          pendingApprovals.length > 0 ? (
            pendingApprovals.map(renderApprovalCard)
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Pending Requests</h3>
              <p className="text-gray-500">All approval requests have been processed.</p>
            </div>
          )
        ) : (
          <>
            {approvals.length > 0 ? (
              approvals.map(renderApprovalCard)
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Approval Requests</h3>
                <p className="text-gray-500">No approval requests found with the current filters.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && renderApprovalModal()}
    </div>
  );
};

export default DoctorApprovalManager; 