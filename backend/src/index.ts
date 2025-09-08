import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import contactRoutes from "./routes/contacts";
import path from "path";
import importRoutes from "./routes/import";
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

// serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/auth", userRoutes);
app.use("/contacts", contactRoutes);
app.use("/import", importRoutes);
app.use("/auth", authRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
