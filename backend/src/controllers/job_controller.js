import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import { analyzeResumeAgainstJob } from "../services/jobAnalysis.js";

/**
 * @desc    Create a new job (Recruiter Only)
 * @route   POST /api/jobs/create
 */
export const createJob = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const {
      title,
      description,
      skills,
      experience,
      type,
      location,
      isRemoteJob,
      minSalary,
      maxSalary
    } = req.body;

    const job = await Job.create({
      title,
      description,
      skills,
      experience,
      type,
      location,
      isRemoteJob,
      salaryRange: {
        min: minSalary,
        max: maxSalary
      },
      postedBy: recruiterId
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



/**
 * @desc    Update job (Recruiter Only)
 * @route   PUT /api/jobs/:id/update
 */
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user._id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this job"
      });
    }

    const updates = req.body;

    if (updates.minSalary || updates.maxSalary) {
      updates.salaryRange = {
        min: updates.minSalary,
        max: updates.maxSalary
      };
      delete updates.minSalary;
      delete updates.maxSalary;
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: "Job updated",
      job: updatedJob
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



/**
 * @desc    Delete job (Recruiter Only)
 * @route   DELETE /api/jobs/:id/delete
 */
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.user._id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this job"
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



/**
 * @desc    Get all jobs (Public)
 * @route   GET /api/jobs/all
 */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



/**
 * @desc    Get job by ID (Public)
 * @route   GET /api/jobs/:id
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



/**
 * @desc    Get jobs posted by recruiter
 * @route   GET /api/jobs/my-jobs
 */
export const getMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({ postedBy: recruiterId }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/**
 * @desc    Analyze job for applicant (Pre-Apply)
 * @route   GET /api/jobs/:id/analyze
 * @access  Applicant
 */
export const analyzeJobForApplicant = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    const resume = await Resume.findOne({ userId }).sort({
      createdAt: -1
    });

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Resume not found"
      });
    }

    const analysis = analyzeResumeAgainstJob(job, resume);

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error("Analyze Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
