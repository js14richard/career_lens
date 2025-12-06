import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    skills: {
      type: [String],
      default: []
    },

    experience: {
      type: Number,
      default: 0
    },

    type: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time"
    },

    location: {
      type: String,
      required: true
    },

    isRemoteJob: {
      type: Boolean,
      default: false
    },

    salaryMin: {
      type: Number,
      default: 0
    },

    salaryMax: {
      type: Number,
      default: 0
    },

    salaryCurrency: {
      type: String,
      default: "INR"
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
