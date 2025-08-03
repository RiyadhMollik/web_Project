import React from "react";
import { motion } from "framer-motion";
import HomepageAppointment from "../Components/Appointment/HomepageAppointment";
import BlogPreview from "../Blog/BlogPreview";
import NewsletterSubscription from "../NewsletterSubscription/NewsletterSubscription";
import TestimonialSection from "../TestimonialSection/TestimonialSection";
 // ensure this image exists

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
          background: "linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%)",
          padding: "80px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            gap: "40px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: 1 }}
          >
            <h1 style={{ fontSize: "3.2rem", fontWeight: "bold", marginBottom: "20px", color: "#0d1b2a" }}>
              CureSync — Seamlessly Connect Patients with Trusted Doctors
            </h1>
            <p
              style={{
                fontSize: "1.3rem",
                marginBottom: "30px",
                maxWidth: "800px",
                margin: "0 auto",
                lineHeight: "1.6",
                color: "#1f3b57",
              }}
            >
              Welcome to the future of healthcare. CureSync empowers patients and doctors to manage appointments, medical reports, prescriptions, and billing all in one smart platform.
            </p>
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "30px",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "14px 28px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,123,255,0.2)",
                }}
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "14px 28px",
                  backgroundColor: "transparent",
                  color: "#007BFF",
                  border: "2px solid #007BFF",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ flex: 1 }}
          >
            <img
              src="https://i.ibb.co/020000/hero-image.png"
              alt="Doctor and patient appointment illustration"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "12px" }}
            />
          </motion.div>
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
              fontSize: "2rem",
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
            {[...[
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
            ]].map((feature, index) => (
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
      <BlogPreview />
      <TestimonialSection />
      <NewsletterSubscription />
    </div>
  );
};

export default Home;