import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    bloodGroup: "",
    emergencyContact: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate("/");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-black text-center mb-6">Create a CureSync Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
          />

          {/* Role Selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>

          {/* Common Fields */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
          />
          
          <textarea
            name="address"
            placeholder="Address"
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
            rows="2"
          />
          
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
          />
          
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Doctor-specific fields */}
          {formData.role === 'doctor' && (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                onChange={handleChange}
              />
              <input
                type="text"
                name="licenseNumber"
                placeholder="License Number"
                className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                onChange={handleChange}
              />
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                onChange={handleChange}
              />
            </>
          )}

          {/* Patient-specific fields */}
          {formData.role === 'patient' && (
            <>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              <input
                type="tel"
                name="emergencyContact"
                placeholder="Emergency Contact"
                className="w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                onChange={handleChange}
              />
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
