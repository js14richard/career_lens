import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config(); 
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();


app.get("/", (req, res) => {
    res.send("Default route test");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

export default app;