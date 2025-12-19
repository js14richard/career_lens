import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/roleCheck.js";
import upload from "../middleware/multer.js";
import {
  uploadResume,
  getMyResumes,
  deleteResume,
  analyzeResume, 
  getResumeById,
} from "../controllers/resume_controller.js";


const router = express.Router();

/**
 * Upload resume (applicant only)
 */
router.post(
  "/upload",
  auth,
  role("applicant"),
  upload.single("resume"),
  uploadResume
);

/**
 * Get all resumes of logged-in applicant
 */
router.get(
  "/me",
  auth,
  role("applicant"),
  getMyResumes
);

/**
 * Get all resumes of logged-in applicant
 */
router.get(
  "/:resumeId",
  auth,
  role("recruiter"),
  getResumeById
);

/**
 * Delete a resume
 */
router.delete(
  "/:resumeId",
  auth,
  role("applicant"),
  deleteResume
);


/**
 * Analyze resume using AI
 */
router.post("/analyze", auth, analyzeResume);

export default router;
