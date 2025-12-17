import { Routes, Route } from "react-router-dom";
import Home from "../pages/static/Home";
import About from "../pages/static/About";
import HowItWorks from "../pages/static/HowItWorks";
import Features from "../pages/static/Features";
import Contact from "../pages/static/Contact";
import NotFound from "../pages/static/NotFound";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RecruiterRoutes from "./RecruiterRoutes";
import ProtectedRoute from "../auth/ProtectedRoute";
import ApplicantDashboard from "../pages/applicant/Dashboard";

import PublicJobDetails from "../pages/jobs/PublicJobDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/jobs/:jobId" element={<PublicJobDetails />} />

      {/* APPLICANT */}
      <Route
        path="/applicant"
        element={<ProtectedRoute allowedRoles={["applicant"]} />}
      >
        <Route path="dashboard" element={<ApplicantDashboard />} />
      </Route>

      {/* ✅ RECRUITER (FIXED) */}
      <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]} />
          }
      >
        <Route path="*" element={<RecruiterRoutes />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
