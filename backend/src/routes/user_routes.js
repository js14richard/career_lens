import express from "express";
import { getUserProfile, updateUserProfile, uploadProfilePicture } from "../controllers/user_controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

/**
 * Get loggedIn user profile endpoint
 */
router.get("/me", auth, getUserProfile);

/**
 * Update User profile Endpoint
 */
router.put("/update", auth, updateUserProfile);

/**
 * Upload photo endpoint
 */
router.post("/upload-photo", auth, upload.single("image"), uploadProfilePicture);

export default router;
