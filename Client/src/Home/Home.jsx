import React from "react";
import HomepageAppointment from "../Components/Appointment/HomepageAppointment";

const Home = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#000000",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
          🏠 CureSync - Connecting Patients with Verified Doctors
        </h1>
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "15px",
            fontWeight: "normal",
          }}
        >
          Centralized Healthcare Platform for Patients & Doctors
        </h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "30px", opacity: 0.9 }}>
          Manage appointments, upload medical records, view prescriptions, and
          access all your health services in one place.
        </p>
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Get Started
          </button>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Explore Features
          </button>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login / Sign Up
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ backgroundColor: "#f8f9fa", padding: "60px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "40px",
              color: "#2c3e50",
            }}
          >
            🧩 Key Features
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            {[
              {
                icon: "🔐",
                title: "Secure Role-Based Login",
                desc: "Patients, Doctors, and Admins access tailored dashboards with privacy and control.",
              },
              {
                icon: "📅",
                title: "Appointment Booking",
                desc: "Patients can search and book appointments based on doctor availability and hospital schedule.",
              },
              {
                icon: "📁",
                title: "Medical Report Upload",
                desc: "Patients can upload medical records (PDFs/images) and doctors can view them during appointments.",
              },
              {
                icon: "🧾",
                title: "Prescription Management",
                desc: "Doctors can generate and upload prescriptions post consultation for patient access.",
              },
              {
                icon: "📊",
                title: "Medical Test Reports",
                desc: "Upload and manage lab/test results linked to patient profiles.",
              },
              {
                icon: "💵",
                title: "Billing & Invoicing",
                desc: "Auto-generate invoices and pay via mock in-app currency wallet.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "20px" }}>
                  {feature.icon}
                </div>
                <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}>
                  {feature.title}
                </h3>
                <p style={{ color: "#6c757d", lineHeight: "1.6" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Beautiful Appointment System */}
      <HomepageAppointment />

      {/* CTA Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>
          🚀 Ready to Take Control of Your Health?
        </h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "30px", opacity: 0.9 }}>
          Join CureSync today and simplify your healthcare journey.
        </p>
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              padding: "15px 30px",
              backgroundColor: "white",
              color: "#27ae60",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Join Now
          </button>
          <button
            style={{
              padding: "15px 30px",
              backgroundColor: "transparent",
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
