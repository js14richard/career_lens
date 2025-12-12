import Resume from "../models/Resume.js";
import { uploadResumeToCloudinary } from "../services/cloudinaryUpload.js";
import cloudinary from "cloudinary";

/**
 * Upload Resume (Applicant Only)
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file provided" });
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        message: "Invalid file type. Only PDF and Word documents are allowed." 
      });
    }

    const { url, publicId } = await uploadResumeToCloudinary(req.file.path);

    const resume = await Resume.create({
      userId: req.user._id,
      fileUrl: url,       
      publicId: publicId, 
      skills: [],
      summary: "",
      extractedText: ""
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume
    });
  } catch (error) {
    console.error("Resume Upload Error:", error);
    res.status(500).json({ message: "Resume upload failed", error: error.message });
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
