import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, currentPage]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getMyAppointments(
        statusFilter || null,
        currentPage,
        10
      );
      setAppointments(response.appointments || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await appointmentService.cancelAppointment(appointmentId);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setError("Failed to cancel appointment");
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(
        appointmentId,
        newStatus
      );
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setError("Failed to update appointment status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
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

  const getStatusText = (status) => {
    return status.replace("_", " ").toUpperCase();
  };

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
        <h1 className="text-3xl font-bold text-center mb-8">
          📅 My Appointments
        </h1>

        {error && (
          <div className="mb-6 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <button
            onClick={fetchAppointments}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-2">
              No Appointments Found
            </h2>
            <p className="text-gray-600">
              {statusFilter
                ? `No appointments with status "${statusFilter}"`
                : "You don't have any appointments yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {user.role === "patient"
                        ? `Dr. ${appointment.doctor?.name || "Unknown Doctor"}`
                        : `${appointment.patient?.name || "Unknown Patient"}`}
                    </h3>
                    <p className="text-gray-600">
                      {user.role === "patient"
                        ? appointment.doctor?.specialization ||
                          "Specialization not specified"
                        : `Patient ID: ${appointment.patient?.id}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium">
                      {formatDate(appointment.appointmentDate)} at{" "}
                      {formatTime(appointment.appointmentTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">
                      {appointment.schedule?.hospitalName ||
                        "Location not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="font-medium">
                      ${appointment.consultationFee || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-medium capitalize">
                      {appointment.paymentStatus}
                    </p>
                  </div>
                </div>

                {appointment.symptoms && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Symptoms</p>
                    <p className="text-sm">{appointment.symptoms}</p>
                  </div>
                )}

                {appointment.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {user.role === "doctor" &&
                    appointment.status === "scheduled" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "confirmed")
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "completed")
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                        >
                          Mark Complete
                        </button>
                      </>
                    )}

                  {appointment.status === "scheduled" && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
                    >
                      Cancel
                    </button>
                  )}

                  {user.role === "doctor" &&
                    appointment.status === "confirmed" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(appointment.id, "completed")
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
