import Resume from "../models/Resume.js";
import { uploadResumeToCloudinary, generateSignedResumeUrl } from "../services/cloudinaryUpload.js";
import cloudinary from "cloudinary";
import { extractResumeText } from "../services/resumeParser.js";
import { extractResumeInsights } from "../services/resumeAIService.js";



/**
 * Upload Resume (Applicant Only)
 * 1) Upload to Cloudinary
 * 2) Create initial resume record
 * 3) Call Python FastAPI to extract text
 * 4) Send signed URL to Python for text extraction 
 * 5) Update resume with parsed text
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const existingResume = await Resume.findOne({ userId: req.user._id });
    if (existingResume) {
      return res.status(400).json({
        success: false,
        message: "You already have a resume. Please delete it before uploading a new one."
      });
    }

    const { url, publicId } = await uploadResumeToCloudinary(req.file.path);

    let resume = await Resume.create({
      userId: req.user._id,
      fileUrl: url,
      publicId,
      textContent: "",
      parseStatus: "pending"
    });

    const signedUrl = generateSignedResumeUrl(publicId);
    console.log(`signedUrl--- siril ${signedUrl}`);
    let parsed = null;
    try {
      parsed = await extractResumeText(signedUrl);
    } catch (error) {
      console.error("Python parse error:", error);

      resume.parseStatus = "failed";
      await resume.save();

      return res.status(500).json({
        success: false,
        message: "Resume uploaded but parsing failed",
        resume
      });
    }

    resume.textContent = parsed.text || "";
    resume.parseStatus = "success";
    resume.parsedAt = new Date();

    await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      resume
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({
      success: false,
      message: "Resume upload failed",
      error: error.message
    });
  }
};


/**
 * Get My Resumes
 */
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      createdAt: -1
    });

    res.status(200).json({
      message: "Resumes fetched successfully",
      resumes
    });
  } catch (error) {
    console.error("Get My Resumes Error:", error);
    res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
  }
};


/**
 * Delete Resume
 */
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (resume.publicId) {
      await cloudinary.v2.uploader.destroy(resume.publicId);
    }

    await resume.deleteOne();

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    res.status(500).json({ message: "Failed to delete resume", error: error.message });
  }
};

/**
 * 1. Fetch user's resume
 * 2. Call AI service
 * 3. Update resume with AI output
 */

export const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found. Please upload a resume first."
      });
    }

    if (!resume.textContent || resume.textContent.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Resume text is empty. Parsing may have failed."
      });
    }

    if (resume.skills.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Resume already analyzed",
        data: {
          skills: resume.skills,
          experienceYears: resume.experienceYears,
          summary: resume.summary
        }
      });
    }

    const aiResult = await extractResumeInsights(resume.textContent);

    resume.skills = aiResult.skills;
    resume.experienceYears = aiResult.experienceYears;
    resume.summary = aiResult.summary;

    await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        skills: resume.skills,
        experienceYears: resume.experienceYears,
        summary: resume.summary
      }
    });

  } catch (error) {
    console.error("Analyze Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze resume"
    });
  }
};