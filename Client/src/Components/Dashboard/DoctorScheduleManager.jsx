import React, { useState, useEffect } from "react";
import { doctorScheduleService } from "../../services/doctorScheduleService";

const DoctorScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    hospitalName: "",
    hospitalAddress: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    consultationFee: "",
    maxPatients: "20",
  });

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await doctorScheduleService.getMySchedules();
      setSchedules(response.schedules || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (formData.startTime && formData.endTime) {
      const startMinutes = parseInt(formData.startTime.split(':')[0]) * 60 + parseInt(formData.startTime.split(':')[1]);
      const endMinutes = parseInt(formData.endTime.split(':')[0]) * 60 + parseInt(formData.endTime.split(':')[1]);
      
      if (endMinutes <= startMinutes) {
        setError("End time must be after start time");
        return;
      }
    }

    try {
      const scheduleData = {
        ...formData,
        consultationFee: parseFloat(formData.consultationFee),
        maxPatients: parseInt(formData.maxPatients),
      };

      if (editingSchedule) {
        await doctorScheduleService.updateSchedule(editingSchedule.id, scheduleData);
      } else {
        await doctorScheduleService.createSchedule(scheduleData);
      }

      setIsModalOpen(false);
      setEditingSchedule(null);
      resetForm();
      fetchSchedules();
    } catch (error) {
      setError(error.message || "Failed to save schedule");
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      hospitalName: schedule.hospitalName,
      hospitalAddress: schedule.hospitalAddress,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      consultationFee: schedule.consultationFee.toString(),
      maxPatients: schedule.maxPatients.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await doctorScheduleService.deleteSchedule(scheduleId);
        fetchSchedules();
      } catch (error) {
        setError(error.message || "Failed to delete schedule");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      hospitalName: "",
      hospitalAddress: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      consultationFee: "",
      maxPatients: "20",
    });
  };

  const openModal = () => {
    setEditingSchedule(null);
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
    resetForm();
    setError("");
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            My Schedules
          </h2>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Schedule
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No schedules found. Add your first schedule to start accepting appointments.
          </p>
        ) : (
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getDayDisplayName(schedule.dayOfWeek)}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">
                      <strong>Hospital:</strong> {schedule.hospitalName}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Address:</strong> {schedule.hospitalAddress}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Fee:</strong> ${schedule.consultationFee}
                    </p>
                    <p className="text-gray-600">
                      <strong>Max Patients:</strong> {schedule.maxPatients}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day of Week
                  </label>
                  <select
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={(e) =>
                      setFormData({ ...formData, dayOfWeek: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {getDayDisplayName(day)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={(e) =>
                      setFormData({ ...formData, hospitalName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={(e) =>
                      setFormData({ ...formData, consultationFee: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Patients
                  </label>
                  <input
                    type="number"
                    name="maxPatients"
                    value={formData.maxPatients}
                    onChange={(e) =>
                      setFormData({ ...formData, maxPatients: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Address
                </label>
                <textarea
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, hospitalAddress: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {editingSchedule ? "Update Schedule" : "Add Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorScheduleManager; 