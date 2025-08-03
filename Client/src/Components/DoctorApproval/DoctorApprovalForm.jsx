import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { doctorApprovalService } from '../../services/doctorApprovalService';
import { Upload, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const DoctorApprovalForm = () => {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [formData, setFormData] = useState({
    licenseNumber: '',
    specialization: '',
    experience: '',
    proofDocuments: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    checkApprovalStatus();
  }, []);

  const checkApprovalStatus = async () => {
    try {
      const response = await doctorApprovalService.getMyApprovalStatus();
      setApprovalStatus(response.approval);
    } catch (error) {
      console.error('Error checking approval status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      proofDocuments: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, we'll simulate file upload by storing file names
      // In a real application, you'd upload files to a cloud service
      const documentUrls = formData.proofDocuments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));

      const approvalData = {
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        proofDocuments: documentUrls
      };

      await doctorApprovalService.submitApprovalRequest(approvalData);
      showSuccess('Doctor approval request submitted successfully!');
      
      // Reset form
      setFormData({
        licenseNumber: '',
        specialization: '',
        experience: '',
        proofDocuments: []
      });
      
      // Refresh approval status
      await checkApprovalStatus();
    } catch (error) {
      showError(error.message || 'Failed to submit approval request');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is already a doctor, show message
  if (user.role === 'doctor') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            You are already a doctor!
          </h2>
          <p className="text-green-600">
            Your account has been approved and you can now access doctor features.
          </p>
        </div>
      </div>
    );
  }

  // If there's a pending approval, show status
  if (approvalStatus && approvalStatus.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            {getStatusIcon('pending')}
            <h2 className="text-xl font-semibold text-yellow-800 ml-2">
              Approval Request Pending
            </h2>
          </div>
          <p className="text-yellow-700 mb-4">
            Your doctor approval request is currently under review by our administrators. 
            You will be notified once a decision has been made.
          </p>
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h3 className="font-semibold text-gray-800 mb-2">Request Details:</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">License Number:</span> {approvalStatus.licenseNumber}</p>
              <p><span className="font-medium">Specialization:</span> {approvalStatus.specialization}</p>
              <p><span className="font-medium">Experience:</span> {approvalStatus.experience} years</p>
              <p><span className="font-medium">Submitted:</span> {new Date(approvalStatus.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's a rejected approval, show rejection details
  if (approvalStatus && approvalStatus.status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            {getStatusIcon('rejected')}
            <h2 className="text-xl font-semibold text-red-800 ml-2">
              Approval Request Rejected
            </h2>
          </div>
          <p className="text-red-700 mb-4">
            Your previous doctor approval request was rejected. You can submit a new request with updated information.
          </p>
          {approvalStatus.adminNotes && (
            <div className="bg-white rounded-lg p-4 border border-red-200 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Admin Notes:</h3>
              <p className="text-gray-700">{approvalStatus.adminNotes}</p>
            </div>
          )}
          <button
            onClick={() => setApprovalStatus(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit New Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Doctor Approval Request
          </h2>
          <p className="text-gray-600">
            Submit your credentials to become a doctor on our platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical License Number *
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your medical license number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization *
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Cardiology, Neurology, Pediatrics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              max="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter years of experience"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proof Documents *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PDF, JPG, PNG, DOC up to 10MB each
              </p>
            </div>
            {formData.proofDocuments.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                <ul className="space-y-1">
                  {formData.proofDocuments.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Required Documents:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Medical license certificate</li>
              <li>• Medical degree/diploma</li>
              <li>• Professional experience certificates</li>
              <li>• Any additional relevant credentials</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Submitting Request...' : 'Submit Approval Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorApprovalForm; 