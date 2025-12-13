import Resume from "../models/Resume.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { calculateJobMatch } from "../utils/jobMatch.js";
import { generateJobFitExplanation } from "../services/jobFitAIService.js";

/**
 * Apply to a job (Applicant Only)
 * 1. Ensures the resume has been analyzed using AI.
 * 2. Calculates job match score by comparing resume skills with job skills.
 * 3. Identifies missing skills required for the job
 * 4. Generates an AI-based explanation for the match result
 * 5. Creates a job application with match analysis stored
*/
export const applyToJob = async (req, res) => {
  try {
    const applicantId = req.user._id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const resume = await Resume.findOne({ userId: applicantId });
    if (!resume || !resume.skills.length) {
      return res.status(400).json({
        success: false,
        message: "Please upload and analyze your resume before applying"
      });
    }

    const { matchScore, explanation } = calculateJobMatch(job, resume);

    const aiFeedback = await generateJobFitExplanation(
      explanation,
      job.experience
    );

    const application = await Application.create({
      jobId,
      applicantId,
      resumeId: resume._id,
      status: "applied",
      analysis: {
        matchScore,
        missingSkills: explanation.missingSkills,
        summary: resume.summary,
        aiFeedback
      }
    });

    res.status(201).json({
      success: true,
      message: "Job applied successfully",
      application
    });

  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while applying to job"
    });
  }
};



/**
 * Get all applications of logged-in applicant
*/
export const getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user._id;
    const { status } = req.query;

    const filter = { applicantId };
    const allowedStatuses = ["applied", "reviewed", "selected", "rejected"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status filter"
      });
    }

    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate("jobId", "title location type salaryRange")
      .populate("resumeId", "skills summary")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.error("Get My Applications Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching applications"
    });
  }
};



/**
 * Get applicants for a job (Recruiter Only)
 * Supports filtering and sorting by match score
 */
export const getApplicantsForJob = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const { jobId } = req.params;
    let { minScore, sort } = req.query;
    if (!minScore) minScore = 0;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view applicants for this job"
      });
    }

    const filter = { jobId };

    if (minScore) {
      filter["analysis.matchScore"] = { $gte: Number(minScore) };
    }

    const sortOrder =
      sort === "asc"
        ? { "analysis.matchScore": 1 }
        : { "analysis.matchScore": -1 }; // desc by default 

    const applications = await Application.find(filter)
      .populate("applicantId", "name email profile pictureUrl")
      .sort(sortOrder);

    res.status(200).json({
      success: true,
      count: applications.length,
      applicants: applications
    });

  } catch (error) {
    console.error("Get Applicants Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching applicants"
    });
  }
};



/**
 * Update application status (Recruiter Only)
*/
export const updateApplicationStatus = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["shortlisted", "selected", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    console.log(`applicationId -> ${applicationId}`);

    const application = await Application.findById(applicationId)
      .populate("jobId");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.jobId.postedBy.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this application"
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Error while updating application status" });
  }
};
