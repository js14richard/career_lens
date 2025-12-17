import { Routes, Route, Navigate } from "react-router-dom";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import JobList from "../pages/recruiter/jobs/JobList";
import CreateJob from "../pages/recruiter/jobs/CreateJob";
import JobDetails from "../pages/recruiter/jobs/JobDetails";

function RecruiterRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<RecruiterDashboard />}>
        {/* DEFAULT TAB */}
        <Route index element={<JobList />} />

        {/* JOB ROUTES */}
        <Route path="jobs" element={<JobList />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="jobs/:jobId" element={<JobDetails />} />
      </Route>

      {/* SAFETY */}
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}

export default RecruiterRoutes;
