import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import contactRoutes from "./routes/contacts";
import path from "path";
import fs from "fs";
import importRoutes from "./routes/import";
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

// serve static uploaded files
app.use("/uploads", (req, res, next) => {
  const filePath = path.join(__dirname, "../uploads", req.path);
  console.log(`Serving static file: /uploads${req.path}, full path: ${filePath}`);
  if (fs.existsSync(filePath)) {
    console.log("File exists, serving...");
  } else {
    console.log("File does not exist, will return 404");
  }
  next();
}, express.static(path.join(__dirname, "../uploads")));

app.use("/auth", userRoutes);
app.use("/contacts", contactRoutes);
app.use("/import", importRoutes);
app.use("/auth", authRoutes);


const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${BASE_URL}`);
});
