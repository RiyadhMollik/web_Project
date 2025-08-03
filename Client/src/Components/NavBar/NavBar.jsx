import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";

// Static doctor data for search suggestions
const doctorSuggestions = [
  { id: 1, doctorName: "Dr. Smith", specialty: "Cardiologist" },
  { id: 2, doctorName: "Dr. Patel", specialty: "Neurologist" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate("/doctor-appointment", { state: { search } });
      setOpen(false);
      setSearchFocused(false);
    }
  };

  const handleSuggestionClick = (doctor) => {
    navigate("/doctor-appointment", { state: { search: doctor.doctorName } });
    setSearch(doctor.doctorName);
    setSearchFocused(false);
    setOpen(false);
  };

  const handleUserIconClick = () => {
    setUserMenuOpen((prev) => !prev);
  };

  const handleDashboard = () => {
    setUserMenuOpen(false);
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user?.role === "doctor") {
      navigate("/doctor/dashboard");
    } else {
      navigate("/patient/dashboard");
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const filteredSuggestions = search.trim()
    ? doctorSuggestions.filter(
        (doc) =>
          doc.doctorName.toLowerCase().includes(search.toLowerCase()) ||
          doc.specialty.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <header className="bg-blue-600 text-white shadow-lg z-50 flex justify-between items-center h-16 px-4 md:px-8 relative">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-tight transition-colors duration-200 hover:text-blue-200"
        aria-label="Back to homepage"
      >
        CureSync
      </Link>

      {/* Search bar (centered on desktop) */}
      <div className="hidden md:flex w-full max-w-md mx-4 relative">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search doctor by name or specialty..."
            className="w-full px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            autoComplete="off"
          />
        </form>
        {searchFocused && filteredSuggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto">
            {filteredSuggestions.map((doc) => (
              <li
                key={doc.id}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                onMouseDown={() => handleSuggestionClick(doc)}
              >
                <span className="font-medium text-gray-800">
                  {doc.doctorName}
                </span>
                <span className="text-gray-500 ml-2 text-sm">
                  ({doc.specialty})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop menu */}
      <ul className="hidden md:flex items-center space-x-6 font-medium">
        <li>
          <Link
            to="/"
            className="hover:text-blue-200 transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="hover:text-blue-200 transition-colors duration-200"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/features"
            className="hover:text-blue-200 transition-colors duration-200"
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            to="/doctor-appointment"
            className="hover:text-blue-200 transition-colors duration-200"
          >
            Appointment
          </Link>
        </li>
        {!isAuthenticated && (
          <>
            <li>
              <Link
                to="/login"
                className="hover:text-blue-200 transition-colors duration-200"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors duration-200"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
        {isAuthenticated && (
          <li className="relative">
            <FaUserCircle
              size={28}
              title="User"
              className="cursor-pointer hover:text-blue-200 transition-colors duration-200"
              onClick={handleUserIconClick}
            />
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors duration-150"
                  onClick={handleDashboard}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors duration-150"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>

      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-white" />
        )}
      </div>

      {/* Mobile Search Bar */}
      <div
        className={`md:hidden px-4 py-2 relative ${open ? "block" : "hidden"}`}
      >
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search doctor by name or specialty..."
            className="w-full px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            autoComplete="off"
          />
        </form>
        {searchFocused && filteredSuggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto">
            {filteredSuggestions.map((doc) => (
              <li
                key={doc.id}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                onMouseDown={() => handleSuggestionClick(doc)}
              >
                <span className="font-medium text-gray-800">
                  {doc.doctorName}
                </span>
                <span className="text-gray-500 ml-2 text-sm">
                  ({doc.specialty})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile menu */}
      <ul
        className={`md:hidden absolute top-full left-0 w-full bg-blue-600 text-white px-6 py-4 flex flex-col space-y-4 font-semibold transition-all duration-300 ${
          open
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <li>
          <Link
            to="/"
            className="block hover:text-blue-200 transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="block hover:text-blue-200 transition-colors duration-200"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/features"
            className="block hover:text-blue-200 transition-colors duration-200"
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            to="/doctor-appointment"
            className="block hover:text-blue-200 transition-colors duration-200"
          >
            Appointment
          </Link>
        </li>
        {!isAuthenticated && (
          <>
            <li>
              <Link
                to="/login"
                className="block hover:text-blue-200 transition-colors duration-200"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="block bg-white text-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors duration-200 text-center"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
        {isAuthenticated && (
          <li className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition-colors duration-200"
              onClick={handleUserIconClick}
            >
              <FaUserCircle size={28} />
              <span>{user?.name || "User"}</span>
            </div>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors duration-150"
                  onClick={handleDashboard}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors duration-150"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </header>
  );
};

export default Navbar;
