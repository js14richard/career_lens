import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/roleCheck.js";
import upload from "../middleware/multer.js";
import {
  uploadResume,
  getMyResumes,
  deleteResume
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
  "/my-resumes",
  auth,
  role("applicant"),
  getMyResumes
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

export default router;
