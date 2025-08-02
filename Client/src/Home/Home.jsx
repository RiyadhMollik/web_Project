import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/react.svg";
import "./Home.css";

const features = [
  {
    title: "Book Appointments Easily",
    desc: "Find doctors, view schedules, and book appointments online. Upload previous reports for better care.",
    icon: "📅",
  },
  {
    title: "Doctor Verification",
    desc: "Doctors must submit proof and are approved by admin for secure, trusted care.",
    icon: "🩺",
  },
  {
    title: "Patient Profile & Reports",
    desc: "Patients can update profiles and upload/view medical reports securely.",
    icon: "👤",
  },
  {
    title: "Prescription & Billing",
    desc: "Doctors generate prescriptions, upload test reports, and manage billing with in-app currency.",
    icon: "💊",
  },
  {
    title: "Notifications & Feedback",
    desc: "Get notified for appointments, invoices, and provide feedback for continuous improvement.",
    icon: "🔔",
  },
  {
    title: "Search & Filter",
    desc: "Easily search and filter doctors by specialty, hospital, and availability.",
    icon: "🔍",
  },
];

const faqs = [
  {
    q: "How do I register as a doctor?",
    a: "Sign up and upload your credentials. Your account will be reviewed and approved by an admin.",
  },
  {
    q: "Can I upload my medical reports as a patient?",
    a: "Yes, patients can upload and manage their medical reports securely from their profile.",
  },
  {
    q: "How does appointment booking work?",
    a: "Browse doctors, view their schedules, and book an available slot. You can upload previous reports if needed.",
  },
  {
    q: "Is my data secure?",
    a: "Yes, we use secure authentication and role-based access to protect your data.",
  },
];

const testimonials = [
  {
    name: "Amit Sharma",
    role: "Patient",
    text: "Booking appointments and uploading my reports is so easy now. The doctors are verified and trustworthy!",
  },
  {
    name: "Dr. Priya Verma",
    role: "Doctor",
    text: "Managing my schedule and patient records is seamless. The admin approval process ensures only real doctors join.",
  },
  {
    name: "Rohit Singh",
    role: "Patient",
    text: "I love the notifications and the ability to view all my medical history in one place.",
  },
];

const Home = () => {
  // Doctor booking logic (copied/adapted from DoctorAppSystem)
  const [selectedDoctor, setSelectedDoctor] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [appointmentData, setAppointmentData] = React.useState({
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
    <div className="bg-gray-50 text-black">
      {/* Hero Section */}
      <section className="hero-container relative overflow-hidden animate-gradient-x">
        <div className="hero flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              CureSync: Your Digital Doctor Appointment System
            </h1>
            <p className="text-lg mb-6">
              Book appointments, manage medical records, and connect with
              trusted doctors—all in one secure platform.
            </p>
            <div className="flex gap-4">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Login
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0 animate-float">
            <img
              src={heroImg}
              alt="Doctor Appointment"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-16 px-6 md:px-20 bg-white animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-xl transition-transform duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctor List Section */}
      <section
        className="py-16 px-6 md:px-20 bg-blue-100 animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          Book an Appointment with Our Doctors
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 hero-cards">
          {doctors.map((doc, idx) => (
            <div
              key={doc.id}
              className="hero-card flex flex-col items-center text-center animate-fade-in-up"
              style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
            >
              <div className="text-4xl mb-2">🩺</div>
              <h3 className="text-xl font-semibold mb-1">{doc.doctorName}</h3>
              <div className="text-blue-600 mb-2">{doc.specialty}</div>
              <ul className="mb-4 text-sm text-gray-600">
                {doc.schedules.map((s, idx2) => (
                  <li key={idx2}>
                    {s.day}: {s.time}{" "}
                    <span className="text-xs text-blue-400">
                      ({s.hospital})
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary"
                onClick={() => handleDoctorSelect(doc)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal (copied/adapted from DoctorAppSystem) */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up">
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

      {/* Testimonial Section */}
      <section
        className="py-16 px-6 md:px-20 bg-blue-50 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-xl transition-transform duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold mb-4">
                {t.name[0]}
              </div>
              <p className="italic mb-2">"{t.text}"</p>
              <div className="font-semibold">{t.name}</div>
              <div className="text-blue-600 text-sm">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-16 px-6 md:px-20 bg-white text-white animate-fade-in-up"
        style={{ animationDelay: "0.8s" }}
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="join join-vertical w-full">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="collapse collapse-arrow join-item border border-base-300 bg-base-100 mb-2 animate-fade-in-up"
                style={{ animationDelay: `${0.8 + i * 0.05}s` }}
              >
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-lg font-medium">
                  {faq.q}
                </div>
                <div className="collapse-content">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-16 px-6 md:px-20 bg-blue-100 animate-fade-in-up"
        style={{ animationDelay: "1s" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="mb-6">
            Get the latest updates, health tips, and platform news delivered to
            your inbox.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="input input-bordered w-full md:w-auto"
              required
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-16 px-6 md:px-20 bg-gradient-to-br from-blue-200 to-blue-400 text-center animate-fade-in-up"
        style={{ animationDelay: "1.2s" }}
      >
        <h2 className="text-3xl font-bold mb-4">
          Ready to Experience Digital Healthcare?
        </h2>
        <p className="mb-6">
          Join CureSync today and take control of your health journey.
        </p>
        <Link to="/signup" className="btn btn-lg btn-accent">
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
