import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";
import { reviewService } from "../../services/reviewService";

const HomepageAppointment = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [reviews, setReviews] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

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

      // Fetch real reviews from backend
      const reviewsResponse = await reviewService.getDoctorReviews(doctorId);
      setReviews(reviewsResponse.reviews || []);

      // Also fetch doctor schedules
      const schedulesResponse = await appointmentService.getDoctorSchedules(doctorId);
      setDoctorSchedules(schedulesResponse.schedules || []);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setError("Failed to load doctor details");
    }
  };

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

      alert(
        `Appointment booked successfully with ${selectedDoctor.name} on ${
          appointmentData.appointmentDate
        } at ${formatTime(appointmentData.appointmentTime)}`
      );

      handleCloseModal();
      navigate("/patient/dashboard");
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError(error.message || "Failed to book appointment");
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReview.comment.trim()) {
      try {
        const response = await reviewService.addReview(
          doctorDetails.id,
          newReview.rating,
          newReview.comment
        );

        // Refresh reviews
        const reviewsResponse = await reviewService.getDoctorReviews(
          doctorDetails.id
        );
        setReviews(reviewsResponse.reviews || []);

        setNewReview({ rating: 5, comment: "" });
        alert("Review submitted successfully!");
      } catch (error) {
        console.error("Error submitting review:", error);
        alert(error.message || "Failed to submit review");
      }
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await reviewService.deleteReview(reviewId);

        // Refresh reviews
        const reviewsResponse = await reviewService.getDoctorReviews(
          doctorDetails.id
        );
        setReviews(reviewsResponse.reviews || []);

        alert("Review deleted successfully!");
      } catch (error) {
        console.error("Error deleting review:", error);
        alert(error.message || "Failed to delete review");
      }
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            👨‍⚕️ Book Your Doctor Appointment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our experienced medical professionals and book your
            appointment with ease
          </p>
        </div>

        {!isAuthenticated && (
          <div className="mb-8 text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg inline-block">
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
          <div className="mb-8 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
              Only patients can book appointments
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        )}

        {/* Doctor Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {doctors.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">🏥</div>
              <p className="text-xl">No doctors available at the moment.</p>
            </div>
          ) : (
            doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Doctor Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <div className="text-white text-6xl">👨‍⚕️</div>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Dr. {doc.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {doc.specialization || "General Medicine"}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {doc.experience || "5"} years experience
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-400 text-lg mr-2">★★★★★</span>
                    <span className="text-gray-600 text-sm">(4.8)</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                      onClick={() => handleDoctorSelect(doc)}
                      disabled={!isAuthenticated || user.role !== "patient"}
                    >
                      Book Appointment
                    </button>
                    <button
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                      onClick={() => fetchDoctorDetails(doc.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Doctor Details Modal with Reviews */}
        {showDoctorDetails && doctorDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Dr. {doctorDetails.name}
                    </h2>
                    <p className="text-blue-600 text-lg">
                      {doctorDetails.specialization}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDoctorDetails(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Doctor Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Doctor Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <p className="text-gray-900">{doctorDetails.email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Phone:
                        </span>
                        <p className="text-gray-900">
                          {doctorDetails.phone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Experience:
                        </span>
                        <p className="text-gray-900">
                          {doctorDetails.experience || "Not specified"} years
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          License:
                        </span>
                        <p className="text-gray-900">
                          {doctorDetails.licenseNumber || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Address:
                        </span>
                        <p className="text-gray-900">
                          {doctorDetails.address || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                        onClick={() => {
                          setShowDoctorDetails(false);
                          handleDoctorSelect(doctorDetails);
                        }}
                      >
                        Book Appointment with this Doctor
                      </button>
                    </div>

                    {/* Doctor Schedules */}
                    {doctorSchedules.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-800 mb-3">
                          Available Schedules
                        </h4>
                        <div className="space-y-2">
                          {doctorSchedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {getDayDisplayName(schedule.dayOfWeek)}
                                  </h5>
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
                  </div>

                  {/* Reviews Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Patient Reviews
                    </h3>

                    {/* Add Review Form */}
                    {isAuthenticated && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium mb-3">Add Your Review</h4>
                        <form
                          onSubmit={handleReviewSubmit}
                          className="space-y-3"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Rating
                            </label>
                            <select
                              value={newReview.rating}
                              onChange={(e) =>
                                setNewReview({
                                  ...newReview,
                                  rating: parseInt(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            >
                              <option value={5}>5 Stars - Excellent</option>
                              <option value={4}>4 Stars - Very Good</option>
                              <option value={3}>3 Stars - Good</option>
                              <option value={2}>2 Stars - Fair</option>
                              <option value={1}>1 Star - Poor</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Comment
                            </label>
                            <textarea
                              value={newReview.comment}
                              onChange={(e) =>
                                setNewReview({
                                  ...newReview,
                                  comment: e.target.value,
                                })
                              }
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                              placeholder="Share your experience..."
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                          >
                            Submit Review
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center mb-1">
                                <span className="text-yellow-400 mr-2">
                                  {renderStars(review.rating)}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {review.rating}/5
                                </span>
                              </div>
                              <p className="font-medium text-gray-800">
                                {review.patient?.name || "Anonymous"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                              {isAuthenticated &&
                                review.patient?.id === user?.id && (
                                  <button
                                    onClick={() =>
                                      handleReviewDelete(review.id)
                                    }
                                    className="text-red-500 hover:text-red-700 text-sm"
                                  >
                                    ✕
                                  </button>
                                )}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Booking Modal */}
        {isModalOpen && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Book with Dr. {selectedDoctor.name}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  Specialty: {selectedDoctor.specialization || "Not specified"}
                </p>

                <form onSubmit={handleAppointmentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <select
                      name="appointmentDate"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                          onChange={handleSlotSelect}
                          value={appointmentData.appointmentTime}
                        >
                          <option value="">Choose a time slot</option>
                          {availableSlots.map((slot, index) => (
                            <option key={index} value={slot.time}>
                              {formatTime(slot.time)} - ${slot.consultationFee}{" "}
                              - {slot.hospitalName}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms (optional)
                    </label>
                    <textarea
                      name="symptoms"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                      onChange={handleAppointmentChange}
                      value={appointmentData.symptoms}
                      placeholder="Describe your symptoms..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (optional)
                    </label>
                    <textarea
                      name="notes"
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                      onChange={handleAppointmentChange}
                      value={appointmentData.notes}
                      placeholder="Any additional information..."
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="submit"
                      disabled={loading || !appointmentData.appointmentTime}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? "Booking..." : "Confirm Appointment"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomepageAppointment;
