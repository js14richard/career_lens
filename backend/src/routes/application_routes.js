import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/roleCheck.js";

import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus
} from "../controllers/application_controller.js";

const router = express.Router();

/**
 * Applicant Routes
*/

// Apply to a job
router.post("/apply/:jobId", auth, role("applicant"), applyToJob);

// Get all applications of the logged-in applicant
router.get("/my-applications", auth, role("applicant"), getMyApplications);


/**
 * Recruiter Routes
*/

// Get all applicants who applied for a job
router.get("/job/:jobId/applicants", auth, role("recruiter"), getApplicantsForJob);

// Update application status (select/reject)
router.patch("/:applicationId/status", auth, role("recruiter"), updateApplicationStatus);


export default router;
