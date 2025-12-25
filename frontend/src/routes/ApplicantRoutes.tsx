import { Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "../pages/applicant/Dashboard";
import ProfileTab from "../pages/applicant/tabs/ProfileTab";
import AppliedJobsTab from "../pages/applicant/tabs/AppliedJobsTab";
import JobDetails from "../pages/jobs/JobDetails";

function ApplicantRoutes() {
  return (
    <Routes>
      {/* ✅ JOB DETAILS MUST COME FIRST */}
      <Route path="jobs/:id" element={<JobDetails />} />

      {/* DASHBOARD */}
      <Route path="dashboard" element={<CandidateDashboard />}>
        <Route index element={<ProfileTab />} />
        <Route path="profile" element={<ProfileTab />} />
        <Route path="applications" element={<AppliedJobsTab />} />
      </Route>

      {/* ❌ KEEP THIS LAST */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}

export default ApplicantRoutes;
