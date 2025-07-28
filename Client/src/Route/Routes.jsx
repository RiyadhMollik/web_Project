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
import About from "../Home/About";

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
    ],
  },
]);
