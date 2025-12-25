import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/roleCheck.js";
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  analyzeJobForApplicant
} from "../controllers/job_controller.js";

const router = express.Router();

/**
 * Recruiter-only routes
 */
router.post("/create", auth, role("recruiter"), createJob);

router.patch("/:id/update", auth, role("recruiter"), updateJob);

router.delete("/:id/delete", auth, role("recruiter"), deleteJob);

router.get("/my-jobs", auth, role("recruiter"), getMyJobs);

router.get("/:jobId/analyze", auth, role("applicant"), analyzeJobForApplicant);

/**
 * Public routes (anyone can view jobs)
 */
router.get("/all", getAllJobs);

router.get("/:id", getJobById);

export default router;
