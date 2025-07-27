import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated login state
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleUserIconClick = () => {
    setUserMenuOpen((prev) => !prev);
  };

  const handleDashboard = () => {
    setUserMenuOpen(false);
    navigate("/patient-profile");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="shadow-md bg-white text-gray-800 z-50 flex justify-between items-center h-16 relative">
      {/* Logo */}
      <Link
        to="/"
        className="text-xl font-bold whitespace-nowrap"
        aria-label="Back to homepage"
      >
        CureSync
      </Link>

      {/* Search bar (centered on desktop) */}
      <div className="hidden md:block w-1/3 mx-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop menu */}
      <ul className="hidden md:flex items-center space-x-6 font-medium">
        <li>
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>
        </li>
        <li>
          <Link to="/doctor-appointment" className="hover:text-blue-600">
            Appoinment
          </Link>
        </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-blue-600">
                Sign Up
              </Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <li className="relative">
            <FaUserCircle
              size={28}
              title="User"
              className="cursor-pointer"
              onClick={handleUserIconClick}
            />
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                  onClick={handleDashboard}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
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
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </div>

      {/* Mobile menu */}
      <ul
        className={`md:hidden absolute top-full left-0 w-full bg-slate-100 px-6 py-4 flex flex-col space-y-4 font-semibold transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <li>
          <Link to="/" className="block">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="block">
            About
          </Link>
        </li>
        <li>
          <Link to="/doctor-appointment" className="block">
            Appoinment
          </Link>
        </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/login" className="block">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="block">
                Sign Up
              </Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <li className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleUserIconClick}
            >
              <FaUserCircle size={28} />
              <span>User</span>
            </div>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                  onClick={handleDashboard}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100"
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
