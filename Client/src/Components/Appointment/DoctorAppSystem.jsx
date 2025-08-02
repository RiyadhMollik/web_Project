import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";

const DoctorAppSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const searchQuery = location.state?.search?.toLowerCase() || "";

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointmentData, setAppointmentData] = useState({
    doctorId: "",
    scheduleId: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
    notes: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAllDoctors();
      setDoctors(response.users || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const response = await appointmentService.getAvailableSlots(
        selectedDoctor.id,
        selectedDate
      );
      setAvailableSlots(response.availableSlots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setError('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const filteredDoctors = searchQuery
    ? doctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery) ||
          doc.specialization?.toLowerCase().includes(searchQuery)
      )
    : doctors;

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentData({
      doctorId: doctor.id,
      scheduleId: "",
      appointmentDate: "",
      appointmentTime: "",
      symptoms: "",
      notes: "",
    });
    setSelectedDate("");
    setAvailableSlots([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setAppointmentData({
      doctorId: "",
      scheduleId: "",
      appointmentDate: "",
      appointmentTime: "",
      symptoms: "",
      notes: "",
    });
    setSelectedDate("");
    setAvailableSlots([]);
    setError("");
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setAppointmentData((prev) => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: "",
      scheduleId: "",
    }));
  };

  const handleSlotSelect = (slot) => {
    setAppointmentData((prev) => ({
      ...prev,
      appointmentTime: slot.time,
      scheduleId: slot.scheduleId,
    }));
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Please login to book an appointment");
      return;
    }

    if (user.role !== 'patient') {
      setError("Only patients can book appointments");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await appointmentService.bookAppointment(appointmentData);
      
      alert(`Appointment booked successfully with ${selectedDoctor.name} on ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}`);
      
      handleCloseModal();
      navigate('/patient/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(error.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        👨‍⚕️ Doctor Appointment Booking
      </h1>

      {!isAuthenticated && (
        <div className="mb-6 text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Please <button onClick={() => navigate('/login')} className="underline font-bold">login</button> to book appointments
          </div>
        </div>
      )}

      {isAuthenticated && user.role !== 'patient' && (
        <div className="mb-6 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Only patients can book appointments
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="mb-6 text-center">
          <span className="text-blue-600">
            Showing results for "{location.state?.search}"
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No doctors found.
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white shadow-md p-6 rounded-lg space-y-2 border border-gray-200"
            >
              <h2 className="text-xl font-semibold">Dr. {doc.name}</h2>
              <p className="text-gray-600">Specialty: {doc.specialization || 'Not specified'}</p>
              <p className="text-gray-600">Experience: {doc.experience || 'Not specified'} years</p>
              <p className="text-gray-600">License: {doc.licenseNumber || 'Not specified'}</p>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                  onClick={() => handleDoctorSelect(doc)}
                  disabled={!isAuthenticated || user.role !== 'patient'}
                >
                  Book Appointment
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                  onClick={() => navigate(`/doctor/${doc.id}`)}
                >
                  See Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Booking with Dr. {selectedDoctor.name}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Specialty: {selectedDoctor.specialization || 'Not specified'}
            </p>

            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={handleDateChange}
                  value={selectedDate}
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Time Slots
                  </label>
                  {loadingSlots ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading available slots...</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`p-2 text-sm rounded-md border transition ${
                            appointmentData.appointmentTime === slot.time
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }`}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          {formatTime(slot.time)}
                          <div className="text-xs mt-1">
                            ${slot.consultationFee}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No available slots for this date</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms (optional)
                </label>
                <textarea
                  name="symptoms"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={handleAppointmentChange}
                  value={appointmentData.symptoms}
                  placeholder="Describe your symptoms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (optional)
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={handleAppointmentChange}
                  value={appointmentData.notes}
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="submit"
                  disabled={loading || !appointmentData.appointmentTime}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Booking..." : "Confirm Appointment"}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppSystem;
