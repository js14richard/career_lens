import { Routes, Route } from "react-router-dom";
import Home from "../pages/static/Home";
import About from "../pages/static/About";
import HowItWorks from "../pages/static/HowItWorks";
import Features from "../pages/static/Features";
import Contact from "../pages/static/Contact";
import NotFound from "../pages/static/NotFound";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "../auth/ProtectedRoute";
import CandidateDashboard from "../pages/candidate/Dashboard";
import RecruiterDashboard from "../pages/recruiter/Dashboard";

function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
