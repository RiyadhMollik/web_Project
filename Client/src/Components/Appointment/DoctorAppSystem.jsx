import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DoctorAppSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = location.state?.search?.toLowerCase() || "";

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    email: "",
    date: "",
    time: "",
    report: null,
  });

  const doctors = [
    {
      id: 1,
      doctorName: "Dr. Smith",
      specialty: "Cardiologist",
      schedules: [
        {
          day: "Monday",
          time: "10:00 AM - 2:00 PM",
          hospital: "City Hospital",
        },
        {
          day: "Wednesday",
          time: "1:00 PM - 5:00 PM",
          hospital: "Green Valley Clinic",
        },
      ],
    },
    {
      id: 2,
      doctorName: "Dr. Patel",
      specialty: "Neurologist",
      schedules: [
        {
          day: "Tuesday",
          time: "9:00 AM - 1:00 PM",
          hospital: "Sunrise Hospital",
        },
        { day: "Friday", time: "2:00 PM - 6:00 PM", hospital: "City Hospital" },
      ],
    },
  ];

  const filteredDoctors = searchQuery
    ? doctors.filter(
        (doc) =>
          doc.doctorName.toLowerCase().includes(searchQuery) ||
          doc.specialty.toLowerCase().includes(searchQuery)
      )
    : doctors;

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentData({
      patientName: "",
      email: "",
      date: "",
      time: "",
      report: null,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleAppointmentChange = (e) => {
    const { name, value, files } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const convertTo24HourFormat = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleScheduleClick = (day, time) => {
    const getNextDate = (dayName) => {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const targetDay = daysOfWeek.indexOf(dayName);
      const today = new Date();
      const resultDate = new Date();
      resultDate.setDate(
        today.getDate() + ((targetDay + 7 - today.getDay()) % 7 || 7)
      );
      return resultDate.toISOString().split("T")[0]; // YYYY-MM-DD
    };

    const selectedDate = getNextDate(day);
    const startTime = time.split(" - ")[0];
    const formattedTime = convertTo24HourFormat(startTime);

    setAppointmentData((prev) => ({
      ...prev,
      date: selectedDate,
      time: formattedTime,
    }));
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    alert(
      `Appointment booked with ${selectedDoctor.doctorName} on ${appointmentData.date} at ${appointmentData.time}`
    );
    setIsModalOpen(false);
    setSelectedDoctor(null);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        👨‍⚕️ Doctor Appointment Booking
      </h1>

      {searchQuery && (
        <div className="mb-6 text-center">
          <span className="text-blue-600">
            Showing results for "{location.state?.search}"
          </span>
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
              className="bg-white shadow-md p-6 rounded-lg space-y-2"
            >
              <h2 className="text-xl font-semibold">{doc.doctorName}</h2>
              <p className="text-gray-600">Specialty: {doc.specialty}</p>
              <div className="flex gap-2 mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => handleDoctorSelect(doc)}
                >
                  Book Appointment
                </button>
                <button
                  className="btn btn-outline"
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
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Booking with {selectedDoctor.doctorName}
              </h2>
              <button
                onClick={handleCloseModal}
                className="btn btn-sm btn-circle"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Specialty: {selectedDoctor.specialty}
            </p>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Available Schedule</h3>
              <ul className="space-y-2">
                {selectedDoctor.schedules.map((s, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer flex justify-between text-sm bg-gray-100 hover:bg-blue-100 transition p-2 rounded-md"
                    onClick={() => handleScheduleClick(s.day, s.time)}
                  >
                    <span>{s.day}</span>
                    <span>{s.time}</span>
                    <span>{s.hospital}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <input
                type="text"
                name="patientName"
                placeholder="Patient Name"
                required
                className="input input-bordered w-full"
                onChange={handleAppointmentChange}
                value={appointmentData.patientName}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="input input-bordered w-full"
                onChange={handleAppointmentChange}
                value={appointmentData.email}
              />
              <input
                type="date"
                name="date"
                required
                className="input input-bordered w-full"
                onChange={handleAppointmentChange}
                value={appointmentData.date}
              />
              <input
                type="time"
                name="time"
                required
                className="input input-bordered w-full"
                onChange={handleAppointmentChange}
                value={appointmentData.time}
              />

              <div>
                <label className="block font-medium">
                  Upload Report (PDF, optional)
                </label>
                <input
                  type="file"
                  name="report"
                  accept=".pdf"
                  className="file-input file-input-bordered w-full"
                  onChange={handleAppointmentChange}
                />
              </div>

              <div className="flex justify-between items-center">
                <button type="submit" className="btn btn-primary">
                  Confirm Appointment
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
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
