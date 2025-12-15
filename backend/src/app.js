import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); 
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import jobRoutes from "./routes/job_routes.js";
import applicationRoutes from "./routes/application_routes.js";
import resumeRoutes from "./routes/resume_routes.js";


const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // frontend localhost URL
    credentials: true,              
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());


connectDB();


app.get("/", (req, res) => {
    res.send("Default route test");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resumes", resumeRoutes);


export default app;