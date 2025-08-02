import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingAppointment, setUpdatingAppointment] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await appointmentService.getMyAppointments();
      setAppointments(response.appointments || []);
      setTotalPages(
        Math.ceil((response.appointments || []).length / itemsPerPage)
      );
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setUpdatingAppointment(appointmentId);
      await appointmentService.updateAppointmentStatus(
        appointmentId,
        newStatus
      );
      await fetchAppointments(); // Refresh the list
      alert(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update appointment status");
    } finally {
      setUpdatingAppointment(null);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setUpdatingAppointment(appointmentId);
      await appointmentService.cancelAppointment(appointmentId);
      await fetchAppointments(); // Refresh the list
      alert("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment");
    } finally {
      setUpdatingAppointment(null);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no_show":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isPatient = user.role === "patient";
  const isDoctor = user.role === "doctor";

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {isPatient ? "My Appointments" : "Patient Appointments"}
          </h1>
          <button
            onClick={fetchAppointments}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filter Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium">Filter by status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        {/* Appointments List */}
        {paginatedAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {filter === "all"
                ? "No appointments found"
                : `No ${filter} appointments found`}
            </div>
            {isPatient && (
              <button
                onClick={() => (window.location.href = "/doctor-appointment")}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Book Your First Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {isPatient
                            ? `Dr. ${
                                appointment.doctor?.name || "Unknown Doctor"
                              }`
                            : `${
                                appointment.patient?.name || "Unknown Patient"
                              }`}
                        </h3>
                        <p className="text-gray-600">
                          {isPatient
                            ? appointment.doctor?.specialization ||
                              "Specialization not specified"
                            : `Patient ID: ${appointment.patientId}`}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Date:</span>
                        <p className="text-gray-900">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Time:</span>
                        <p className="text-gray-900">
                          {formatTime(appointment.appointmentTime)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fee:</span>
                        <p className="text-gray-900">
                          ${appointment.consultationFee}
                        </p>
                      </div>
                      {appointment.symptoms && (
                        <div className="sm:col-span-2 lg:col-span-3">
                          <span className="font-medium text-gray-700">
                            Symptoms:
                          </span>
                          <p className="text-gray-900">
                            {appointment.symptoms}
                          </p>
                        </div>
                      )}
                      {appointment.notes && (
                        <div className="sm:col-span-2 lg:col-span-3">
                          <span className="font-medium text-gray-700">
                            Notes:
                          </span>
                          <p className="text-gray-900">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {isPatient && appointment.status === "scheduled" && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={updatingAppointment === appointment.id}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {updatingAppointment === appointment.id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    )}

                    {isDoctor && appointment.status === "scheduled" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "confirmed")
                          }
                          disabled={updatingAppointment === appointment.id}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {updatingAppointment === appointment.id
                            ? "Updating..."
                            : "Confirm"}
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "cancelled")
                          }
                          disabled={updatingAppointment === appointment.id}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {updatingAppointment === appointment.id
                            ? "Updating..."
                            : "Cancel"}
                        </button>
                      </>
                    )}

                    {isDoctor && appointment.status === "confirmed" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(appointment.id, "completed")
                        }
                        disabled={updatingAppointment === appointment.id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {updatingAppointment === appointment.id
                          ? "Updating..."
                          : "Mark Complete"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total:</span>
              <p className="font-medium">{appointments.length}</p>
            </div>
            <div>
              <span className="text-gray-600">Scheduled:</span>
              <p className="font-medium">
                {appointments.filter((a) => a.status === "scheduled").length}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Confirmed:</span>
              <p className="font-medium">
                {appointments.filter((a) => a.status === "confirmed").length}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Completed:</span>
              <p className="font-medium">
                {appointments.filter((a) => a.status === "completed").length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
