import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { medicalReportService } from "../../services/medicalReportService";
import { authService } from "../../services/authService";
import { FileText, Upload, Download, Trash2, Edit, Calendar, User } from "lucide-react";

const PatientProfile = () => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: "",
    gender: user?.gender || "male",
    profilePhoto: null,
  });

  const [medicalReportData, setMedicalReportData] = useState({
    reportType: "blood_test",
    reportTitle: "",
    reportDate: "",
    description: "",
    medicalReport: null,
  });

  const [reportHistory, setReportHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  // Fetch medical reports on component mount
  useEffect(() => {
    fetchMedicalReports();
  }, []);

  const fetchMedicalReports = async () => {
    try {
      setLoading(true);
      const response = await medicalReportService.getMyMedicalReports();
      setReportHistory(response.reports || []);
    } catch (error) {
      console.error('Error fetching medical reports:', error);
      showError('Failed to fetch medical reports');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMedicalReportChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setMedicalReportData({ ...medicalReportData, [name]: files[0] });
    } else {
      setMedicalReportData({ ...medicalReportData, [name]: value });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
      };

      if (formData.age) {
        updateData.age = parseInt(formData.age);
      }

      await authService.updateProfile(updateData);
      updateProfile(updateData);
      showSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleMedicalReportSubmit = async (e) => {
    e.preventDefault();
    
    if (!medicalReportData.medicalReport) {
      showError('Please select a medical report file');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('patientId', user.id);
      formData.append('reportType', medicalReportData.reportType);
      formData.append('reportTitle', medicalReportData.reportTitle);
      formData.append('reportDate', medicalReportData.reportDate);
      formData.append('description', medicalReportData.description);
      formData.append('medicalReport', medicalReportData.medicalReport);

      await medicalReportService.uploadMedicalReport(formData);
      
      // Reset form
      setMedicalReportData({
        reportType: "blood_test",
        reportTitle: "",
        reportDate: "",
        description: "",
        medicalReport: null,
      });
      
      // Refresh reports list
      await fetchMedicalReports();
      
      showSuccess('Medical report uploaded successfully');
    } catch (error) {
      console.error('Error uploading medical report:', error);
      showError(error.message || 'Failed to upload medical report');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadReport = async (report) => {
    try {
      // Extract filename from fileUrl (e.g., "/uploads/medical-reports/filename.pdf" -> "filename.pdf")
      const filename = report.fileUrl.split('/').pop();
      await medicalReportService.downloadMedicalReport(filename);
      showSuccess('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      showError('Failed to download report');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this medical report?')) {
      return;
    }

    try {
      await medicalReportService.deleteMedicalReport(reportId);
      await fetchMedicalReports();
      showSuccess('Medical report deleted successfully');
    } catch (error) {
      console.error('Error deleting medical report:', error);
      showError(error.message || 'Failed to delete medical report');
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 space-y-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Patient Profile & Medical Reports</h2>

        {/* Profile Update Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Update Profile Information
          </h3>
          
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                required
                className="input input-bordered w-full"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                required
                className="input input-bordered w-full"
                onChange={handleChange}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                className="input input-bordered w-full"
                onChange={handleChange}
              />
              <select
                name="gender"
                className="select select-bordered w-full"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Profile photo (optional) */}
            <div>
              <label className="label font-medium">Profile Photo (optional)</label>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Medical Report Upload Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload New Medical Report
          </h3>
          
          <form onSubmit={handleMedicalReportSubmit} encType="multipart/form-data" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="reportType"
                value={medicalReportData.reportType}
                className="select select-bordered w-full"
                onChange={handleMedicalReportChange}
                required
              >
                <option value="blood_test">Blood Test</option>
                <option value="xray">X-Ray</option>
                <option value="mri">MRI Scan</option>
                <option value="ct_scan">CT Scan</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="ecg">ECG</option>
                <option value="other">Other</option>
              </select>
              
              <input
                type="date"
                name="reportDate"
                value={medicalReportData.reportDate}
                className="input input-bordered w-full"
                onChange={handleMedicalReportChange}
                required
              />
            </div>
            
            <input
              type="text"
              name="reportTitle"
              placeholder="Report Title (e.g., Blood Test Results)"
              value={medicalReportData.reportTitle}
              className="input input-bordered w-full"
              onChange={handleMedicalReportChange}
              required
            />
            
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={medicalReportData.description}
              className="textarea textarea-bordered w-full"
              rows="3"
              onChange={handleMedicalReportChange}
            />

            <div>
              <label className="label font-medium">Medical Report File (PDF/Image)</label>
              <input
                type="file"
                name="medicalReport"
                accept=".pdf,image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleMedicalReportChange}
                required
              />
              <p className="text-sm text-gray-500 mt-1">Maximum file size: 10MB. Supported formats: PDF, JPG, PNG, GIF</p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="btn btn-secondary w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Medical Report'}
            </button>
          </form>
        </div>

        {/* Medical Report History */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Medical Reports History
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : reportHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No medical reports uploaded yet.</p>
              <p className="text-gray-400 text-sm">Upload your first medical report using the form above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reportHistory.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-primary">{report.reportType.replace('_', ' ').toUpperCase()}</span>
                        <h4 className="font-semibold text-lg">{report.reportTitle}</h4>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Report Date: {new Date(report.reportDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Uploaded: {new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {report.description && (
                        <p className="text-gray-700 text-sm mb-2">{report.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="btn btn-sm btn-outline btn-primary"
                        title="Download Report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="btn btn-sm btn-outline btn-error"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
