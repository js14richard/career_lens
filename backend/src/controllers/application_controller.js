import Application from "../models/Application.js";
import Job from "../models/Job.js";

/**
 * Apply to a job (Applicant Only)
*/
export const applyToJob = async (req, res) => {
  try {
    const applicantId = req.user._id;
    const { jobId } = req.params;
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId is required"
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() === applicantId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own job posting"
      });
    }

    const existingApplication = await Application.findOne({
      jobId,
      applicantId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job"
      });
    }

    const application = await Application.create({
      jobId,
      applicantId,
      resumeId,
      status: "applied"
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({ success: false, message: "Error while applying to job" });
  }
};



/**
 * Get all applications of logged-in applicant
*/
export const getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user._id;

    const applications = await Application.find({ applicantId })
      .populate("jobId", "title location type salaryRange")
      .populate("resumeId", "skills summary")  // optional
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.error("Get My Applications Error:", error);
    res.status(500).json({ success: false, message: "Error while fetching applications" });
  }
};



/**
 * Get all applicants for a job (Recruiter Only)
*/
export const getApplicantsForJob = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view applicants for this job"
      });
    }

    const applications = await Application.find({ jobId })
      .populate("applicantId", "name email profile pictureUrl")
      .populate("resumeId", "skills summary");

    res.status(200).json({
      success: true,
      job: job.title,
      applicants: applications
    });
  } catch (error) {
    console.error("Get Applicants Error:", error);
    res.status(500).json({ success: false, message: "Error while fetching applicants" });
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
