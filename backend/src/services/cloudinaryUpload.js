import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload Profile Image
 */
export const uploadProfileImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: process.env.CLOUDINARY_PROFILE_FOLDER,
      transformation: [
        { width: 512, height: 512, crop: "fill", gravity: "face" }
      ]
    });

    fs.unlinkSync(filePath); // Remove temp file

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Cloudinary Profile Upload Error:", error);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    throw new Error("Profile image upload failed");
  }
};



/**
 * Upload Resume (PDF/DOCX)
 */
export const uploadResumeToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: process.env.CLOUDINARY_RESUME_FOLDER,
      resource_type: "raw",
      type: "authenticated"
    });

    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Cloudinary Resume Upload Error:", error);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    throw new Error("Resume upload failed");
  }
};


export const generateSignedResumeUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: "raw",
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 300 // 5 minutes
  });
};