import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ============================
   Upload Profile Image
============================ */
export const uploadProfileImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: process.env.CLOUDINARY_PROFILE_FOLDER,
      transformation: [
        { width: 512, height: 512, crop: "fill", gravity: "face" }
      ]
    });

    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw new Error("Profile image upload failed");
  }
};

/* ============================
   Upload Resume (PDF / DOCX)
============================ */
export const uploadResumeToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",                 // ✅ REQUIRED
      folder: process.env.CLOUDINARY_RESUME_FOLDER,
      use_filename: true,
      unique_filename: true,
      type: "upload"                        // ✅ MUST be public
    });

    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,               // ✅ USE THIS
      publicId: result.public_id
    };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw new Error("Resume upload failed");
  }
};
