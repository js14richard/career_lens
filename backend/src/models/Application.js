import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true
    },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "selected", "rejected"],
      default: "applied"
    },

    analysis: {
      matchScore: { type: Number, default: 0 },
      missingSkills: { type: [String], default: [] },
      summary: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);