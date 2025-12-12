import User from "../models/User.js";
import {uploadProfileImageToCloudinary} from "../services/cloudinaryUpload.js";

// GET LOGGED-IN USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, location, headline, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        profile: {
          phone: phone || req.user.profile.phone,
          location: location || req.user.profile.location,
          headline: headline || req.user.profile.headline,
          about: about || req.user.profile.about,
          pictureUrl: req.user.profile.pictureUrl
        }
      },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPLOAD PROFILE PICTURE ENDPOINT
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Only images are allowed." });
    }

    const { url, publicId } = await uploadProfileImageToCloudinary(req.file.path);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        "profile.pictureUrl": url,     
        "profile.picturePublicId": publicId
      },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated",
      pictureUrl: url,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
