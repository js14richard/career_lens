import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false 
    },

    role: {
      type: String,
      enum: ["applicant", "recruiter", "admin"],
      default: "applicant",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    profile: {
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        headline: { type: String, default: "" },
        about: { type: String, default: "" },
        pictureUrl: { 
            type: String, 
            default: "https://res.cloudinary.com/js14richardcloud/image/upload/v1765029986/ProfileImage_abmrtj.jpg" 
        },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);