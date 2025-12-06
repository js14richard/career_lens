import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    textContent: {
        type: String, 
        required: true, 
        default :""
    },

    summary: {
      type: String,
      default: ""
    },

    skills: {
      type: [String],
      default: []
    },

    workExperience: {
      type: [
        {
          company: String,
          role: String,
          startDate: String,
          endDate: String,
          description: String
        }
      ],
      default: []
    },

    education: {
      type: [
        {
          degree: String,
          university: String,
          year: String
        }
      ],
      default: []
    },

    projects: {
      type: [
        {
          title: String,
          description: String,
          techStack: [String]
        }
      ],
      default: []
    },

    certifications: {
      type: [String],
      default: []
    },

    languages: {
      type: [String],
      default: []
    },

    experienceYears: {
      type: Number,
      default: 0
    },

    parseStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },

    parsedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);