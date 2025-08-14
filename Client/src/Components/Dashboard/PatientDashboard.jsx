import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { appointmentService } from "../../services/appointmentService";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    bloodGroup: user?.bloodGroup || "",
    emergencyContact: user?.emergencyContact || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await appointmentService.getMyAppointments();
      setAppointments(response.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await updateProfile(profileData);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">
                Patient Dashboard
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-primary">
                    Profile Information
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {message && (
                  <div
                    className={`mb-4 p-3 rounded ${
                      message.includes("successfully")
                        ? "bg-green-100 text-green-700 border border-green-400"
                        : "bg-red-100 text-red-700 border border-red-400"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={profileData.gender}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              gender: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          Blood Group
                        </label>
                        <select
                          name="bloodGroup"
                          value={profileData.bloodGroup}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              bloodGroup: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary mb-1">
                          Emergency Contact
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              emergencyContact: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-secondary hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Full Name
                      </label>
                      <p className="text-primary">
                        {user?.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Email
                      </label>
                      <p className="text-primary">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Phone
                      </label>
                      <p className="text-primary">
                        {user?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Date of Birth
                      </label>
                      <p className="text-primary">
                        {user?.dateOfBirth || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Gender
                      </label>
                      <p className="text-primary">
                        {user?.gender || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Blood Group
                      </label>
                      <p className="text-primary">
                        {user?.bloodGroup || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Emergency Contact
                      </label>
                      <p className="text-primary">
                        {user?.emergencyContact || "Not provided"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Address
                      </label>
                      <p className="text-primary">
                        {user?.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-primary">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <button
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition"
                  onClick={() => navigate("/doctor-appointment")}
                >
                  Book Appointment
                </button>
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition">
                  View Medical Records
                </button>
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition">
                  Contact Doctor
                </button>
                <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition">
                  Emergency Services
                </button>
              </div>
            </div>

            {/* My Appointments */}
            <div className="bg-white shadow rounded-lg mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-primary">
                    My Appointments
                  </h2>
                  <button
                    onClick={fetchAppointments}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              <div className="p-6">
                {loadingAppointments ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">
                      Loading appointments...
                    </p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No appointments found</p>
                    <button
                      onClick={() => navigate("/doctor-appointment")}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Book your first appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-primary">
                              Dr. {appointment.doctor?.name || "Unknown Doctor"}
                            </p>
                            <p className="text-sm text-secondary">
                              {appointment.doctor?.specialization ||
                                "Specialization not specified"}
                            </p>
                            <p className="text-sm text-secondary">
                              {new Date(
                                appointment.appointmentDate
                              ).toLocaleDateString()}{" "}
                              at {appointment.appointmentTime}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "completed"
                                ? "bg-gray-100 text-gray-800"
                                : appointment.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {appointment.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {appointments.length > 3 && (
                      <div className="text-center pt-2">
                        <button
                          onClick={() => navigate("/appointments")}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View all {appointments.length} appointments
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-primary">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/doctor-appointment")}
                    className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <span className="text-lg">📅</span>
                    <span className="ml-2 font-medium">Book Appointment</span>
                  </button>
                  <button
                    onClick={() => navigate("/invoices")}
                    className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    <span className="text-lg">📄</span>
                    <span className="ml-2 font-medium">View Invoices</span>
                  </button>
                                     <button
                     onClick={() => navigate("/doctor-approval")}
                     className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                   >
                     <span className="text-lg">👨‍⚕️</span>
                     <span className="ml-2 font-medium">Become a Doctor</span>
                   </button>
                   <button
                     onClick={() => navigate("/patient-profile")}
                     className="flex items-center justify-center p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
                   >
                     <span className="text-lg">📋</span>
                     <span className="ml-2 font-medium">Manage Medical Reports</span>
                   </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-primary">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <p className="text-sm text-secondary">Profile updated</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <p className="text-sm text-secondary">
                      Appointment Timeline
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <p className="text-sm text-secondary">
                      Medical record accessed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
