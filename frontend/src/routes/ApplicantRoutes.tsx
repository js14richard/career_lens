import { Routes, Route, Navigate } from "react-router-dom";
import CandidateDashboard from "../pages/applicant/Dashboard";
import ProfileTab from "../pages/applicant/tabs/ProfileTab";
import MyApplications from "../pages/applicant/applications/MyApplications";

function ApplicantRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<CandidateDashboard />}>
        {/* DEFAULT = PROFILE */}
        <Route index element={<ProfileTab />} />

        <Route path="profile" element={<ProfileTab />} />
        <Route path="applications" element={<MyApplications />} />
      </Route>

      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}

export default ApplicantRoutes;
