import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { appointmentService } from "../../services/appointmentService";
import { reviewService } from "../../services/reviewService";
import { invoiceService } from "../../services/invoiceService";

const DoctorAppSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
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
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [doctorSchedules, setDoctorSchedules] = useState([]);

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
      console.error("Error fetching doctors:", error);
      setError("Failed to load doctors");
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
      console.error("Error fetching available slots:", error);
      setError("Failed to load available slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await appointmentService.getDoctorDetails(doctorId);
      setDoctorDetails(response.user);
      setShowDoctorDetails(true);
      
      // Also fetch doctor schedules
      const schedulesResponse = await appointmentService.getDoctorSchedules(doctorId);
      setDoctorSchedules(schedulesResponse.schedules || []);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setError("Failed to load doctor details");
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

  const handleSlotSelect = (e) => {
    const selectedSlot = availableSlots.find(
      (slot) => slot.time === e.target.value
    );
    if (selectedSlot) {
      setAppointmentData((prev) => ({
        ...prev,
        appointmentTime: selectedSlot.time,
        scheduleId: selectedSlot.scheduleId,
      }));
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("Please login to book an appointment");
      return;
    }

    if (user.role !== "patient") {
      setError("Only patients can book appointments");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await appointmentService.bookAppointment(
        appointmentData
      );

      // Generate invoice after successful appointment booking
      try {
        const invoiceResponse = await invoiceService.generateInvoice(response.appointment.id);
        showSuccess(
          `Appointment booked successfully with ${selectedDoctor.name} on ${
            appointmentData.appointmentDate
          } at ${formatTime(appointmentData.appointmentTime)}. Invoice #${invoiceResponse.invoice.invoiceNumber} has been generated.`
        );
      } catch (invoiceError) {
        console.error('Error generating invoice:', invoiceError);
        showSuccess(
          `Appointment booked successfully with ${selectedDoctor.name} on ${
            appointmentData.appointmentDate
          } at ${formatTime(appointmentData.appointmentTime)}`
        );
        showWarning('Invoice generation failed. Please contact support.');
      }

      handleCloseModal();
      navigate("/patient/dashboard");
    } catch (error) {
      console.error("Error booking appointment:", error);
      showError(error.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayDisplayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
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
            Please{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline font-bold"
            >
              login
            </button>{" "}
            to book appointments
          </div>
        </div>
      )}

      {isAuthenticated && user.role !== "patient" && (
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
              <p className="text-gray-600">
                Specialty: {doc.specialization || "Not specified"}
              </p>
              <p className="text-gray-600">
                Experience: {doc.experience || "Not specified"} years
              </p>
              <p className="text-gray-600">
                License: {doc.licenseNumber || "Not specified"}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                  onClick={() => handleDoctorSelect(doc)}
                  disabled={!isAuthenticated || user.role !== "patient"}
                >
                  Book Appointment
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                  onClick={() => fetchDoctorDetails(doc.id)}
                >
                  See Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Doctor Details Modal */}
      {showDoctorDetails && doctorDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Doctor Details - Dr. {doctorDetails.name}
              </h2>
              <button
                onClick={() => setShowDoctorDetails(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900">Dr. {doctorDetails.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{doctorDetails.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <p className="text-gray-900">
                    {doctorDetails.specialization || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <p className="text-gray-900">
                    {doctorDetails.experience || "Not specified"} years
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <p className="text-gray-900">
                    {doctorDetails.licenseNumber || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">
                    {doctorDetails.phone || "Not specified"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {doctorDetails.address || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Doctor Schedules */}
              {doctorSchedules.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Available Schedules
                  </h3>
                  <div className="grid gap-3">
                    {doctorSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {getDayDisplayName(schedule.dayOfWeek)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {schedule.hospitalName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Fee: ${schedule.consultationFee}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  onClick={() => {
                    setShowDoctorDetails(false);
                    handleDoctorSelect(doctorDetails);
                  }}
                >
                  Book Appointment with this Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Booking Modal */}
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
              Specialty: {selectedDoctor.specialization || "Not specified"}
            </p>

            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <select
                  name="appointmentDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={handleDateChange}
                  value={selectedDate}
                >
                  <option value="">Choose a date</option>
                  {getNextWeekDates().map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Time Slot
                  </label>
                  {loadingSlots ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">
                        Loading available slots...
                      </p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <select
                      name="appointmentTime"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      onChange={handleSlotSelect}
                      value={appointmentData.appointmentTime}
                    >
                      <option value="">Choose a time slot</option>
                      {availableSlots.map((slot, index) => (
                        <option key={index} value={slot.time}>
                          {formatTime(slot.time)} - ${slot.consultationFee} -{" "}
                          {slot.hospitalName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No available slots for this date
                    </p>
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
