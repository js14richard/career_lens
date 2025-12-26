import { Routes, Route } from "react-router-dom";
import Home from "../pages/static/Home";
import About from "../pages/static/About";
import HowItWorks from "../pages/static/HowItWorks";
import Contact from "../pages/static/Contact";
import NotFound from "../pages/static/NotFound";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RecruiterRoutes from "./RecruiterRoutes";
import ProtectedRoute from "../auth/ProtectedRoute";
import ApplicantRoutes from "./ApplicantRoutes";
import ExploreJobs from "../pages/static/ExploreJobs";


import PublicJobDetails from "../pages/jobs/PublicJobDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<ExploreJobs />} />


      <Route path="/jobs/:jobId" element={<PublicJobDetails />} />

      {/* ✅ APPLICANT (FIXED LIKE RECRUITER) */}
      <Route
        path="/applicant/*"
        element={<ProtectedRoute allowedRoles={["applicant"]} />}
      >
        <Route path="*" element={<ApplicantRoutes />} />
      </Route>

      {/* ✅ RECRUITER */}
      <Route
        path="/recruiter"
        element={<ProtectedRoute allowedRoles={["recruiter"]} />}
      >
        <Route path="*" element={<RecruiterRoutes />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
