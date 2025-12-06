import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateJWT.js";

import crypto from "crypto";
import sendEmail from "../services/emailService.js";
import generateResetToken from "../utils/generateResetToken.js";

/**
 * REGISTER ENDPOINT
*/

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, headline, about } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "applicant",

      profile: {
        phone: phone || "",
        location: location || "",
        headline: headline || "",
        about: about || "",
        pictureUrl:
          "https://res.cloudinary.com/js14richardcloud/image/upload/v1765029986/ProfileImage_abmrtj.jpg"
      }
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * LOGIN ENDPOINT
 */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked by admin" });
    }

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * LOGOUT ENDPOINT
 */

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};


/**
 * FORGOT PASSWORD ENDPOINT
 */

export const forgotPassword = async (req, res) => {
    const { email } = req.body; 
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Email not found" });

    const { resetToken, hashedToken } = generateResetToken();   

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();  
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;    
    
    const message = `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>The link expires in 15 minutes.</p>
    `;  

    await sendEmail(user.email, "Password Reset - Career Lens", message);   
    res.status(200).json({ message: "Reset link sent to your email" });
};


/**
 * RESET PASSWORD ENPOINT
 */

export const resetPassword = async (req, res) => {
    const resetToken = req.params.token;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
};