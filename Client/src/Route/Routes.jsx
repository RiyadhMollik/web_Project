// router.jsx
import { createBrowserRouter } from "react-router-dom";

// Pages
import Main from "../layout/main";
import Home from "../Home/home";
import Footer from "../Components/Footer/Footer";
import NavBar from "../Components/NavBar/NavBar";
import Login from "../Components/Login/Login";
import Signup from "../Components/Login/SignUp";
import PatientProfile from "../Components/Profile/PatientProfile";
import DoctorAppSystem from "../Components/Appointment/DoctorAppSystem";
import DoctorDetails from "../Components/Appointment/DoctorDetails";
import AppointmentList from "../Components/Appointment/AppointmentList";
import InvoiceList from "../Components/Invoice/InvoiceList";
import DoctorApprovalForm from "../Components/DoctorApproval/DoctorApprovalForm";
import DoctorApprovalManager from "../Components/Admin/DoctorApprovalManager";
import About from "../Home/About";

// Dashboard Components
import PatientDashboard from "../Components/Dashboard/PatientDashboard";
import DoctorDashboard from "../Components/Dashboard/DoctorDashboard";
import AdminDashboard from "../Components/Dashboard/AdminDashboard";

// Protected Route Component
import ProtectedRoute from "../components/ProtectedRoute";
import Blog from "../Blog/Blog";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/footer",
        element: <Footer />,
      },
      {
        path: "/navbar",
        element: <NavBar />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/patient-profile",
        element: <PatientProfile />,
      },
      {
        path: "/doctor-appointment",
        element: <DoctorAppSystem />,
      },
      {
        path: "/doctor/:id",
        element: <DoctorDetails />,
      },
      {
        path: "/appointments",
        element: (
          <ProtectedRoute requiredRoles={["patient", "doctor"]}>
            <AppointmentList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/invoices",
        element: (
          <ProtectedRoute requiredRoles={["patient", "doctor"]}>
            <InvoiceList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/doctor-approval",
        element: (
          <ProtectedRoute requiredRoles={["patient"]}>
            <DoctorApprovalForm />
          </ProtectedRoute>
        ),
      },
      // Dashboard Routes
      {
        path: "/patient/dashboard",
        element: (
          <ProtectedRoute requiredRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/doctor/dashboard",
        element: (
          <ProtectedRoute requiredRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/doctor-approvals",
        element: (
          <ProtectedRoute requiredRoles={["admin"]}>
            <DoctorApprovalManager />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
