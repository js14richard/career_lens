import { Routes, Route, Navigate } from "react-router-dom";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import JobList from "../pages/recruiter/jobs/JobList";
import CreateJob from "../pages/recruiter/jobs/CreateJob";
import JobDetails from "../pages/recruiter/jobs/JobDetails";
import EditJob from "../pages/recruiter/jobs/EditJob";
import ViewApplicants from "../pages/recruiter/jobs/ViewApplicants";
import ApplicantProfile from "../pages/recruiter/applicants/ApplicantProfile";


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
        <Route path="jobs/:jobId/edit" element={<EditJob />} />
        <Route path="jobs/:jobId/applicants" element={<ViewApplicants />} />
        <Route path="applicants/:applicantId" element={<ApplicantProfile />}/>
      </Route>

      {/* SAFETY */}
      <Route
        path="*"
        element={<Navigate to="/recruiter/dashboard" replace />}
      />
    </Routes>
  );
}

export default RecruiterRoutes;
