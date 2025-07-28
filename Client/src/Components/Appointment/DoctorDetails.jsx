import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const doctorList = [
  {
    id: 1,
    doctorName: "Dr. Smith",
    specialty: "Cardiologist",
    description:
      "Dr. Smith is a highly experienced cardiologist with over 15 years of experience in treating heart-related conditions. He is known for his patient-centric approach and expertise in advanced cardiac care.",
    schedules: [
      { day: "Monday", time: "10:00 AM - 2:00 PM", hospital: "City Hospital" },
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
    description:
      "Dr. Patel specializes in neurology and has a passion for helping patients with neurological disorders. She is dedicated to providing comprehensive care and support.",
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

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctorList.find((doc) => doc.id === Number(id));

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Doctor Not Found</h2>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-2">{doctor.doctorName}</h1>
        <div className="text-blue-600 mb-4 text-lg">{doctor.specialty}</div>
        <p className="mb-6 text-gray-700">{doctor.description}</p>
        <h2 className="text-xl font-semibold mb-2">Available Schedules</h2>
        <ul className="mb-6">
          {doctor.schedules.map((s, idx) => (
            <li
              key={idx}
              className="mb-2 flex justify-between bg-blue-50 rounded p-2"
            >
              <span>{s.day}</span>
              <span>{s.time}</span>
              <span className="text-blue-500">{s.hospital}</span>
            </li>
          ))}
        </ul>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back to Doctors
        </button>
      </div>
    </div>
  );
};

export default DoctorDetails;
