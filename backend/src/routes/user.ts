import { Router } from "express";
import prisma from "../prisma";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";

const router = Router();

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, password: hashed } });

    res.json({ token: generateToken(user.id) });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ token: generateToken(user.id) });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
