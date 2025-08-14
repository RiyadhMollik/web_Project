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
<img src="data:image/jpeg;base64,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" className="<h-6></h-6> w-6" alt="" />
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
            to="/blog"
            className="hover:text-blue-200 transition-colors duration-200"
          >
            Blog
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
            to="/blog"
            className="block hover:text-blue-200 transition-colors duration-200"
          >
            Blog
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
                className="block bg-white text-red-600 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors duration-200 text-center"
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
