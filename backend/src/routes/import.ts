import express from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import fs from "fs/promises";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
const vCard = require("vcard-parser");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Helper to clean quotes from CSV
function cleanQuotes(str: string | undefined) {
  if (!str) return "";
  return str.replace(/^"(.*)"$/s, "$1").trim();
}

// Helper to format birthday as ISO string
function formatBirthday(date?: string | null) {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// ---------------- CSV Import ----------------
router.post("/csv", authMiddleware, upload.single("file"), async (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filePath = req.file.path;

  try {
    const csvContent = await fs.readFile(filePath, "utf-8");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const contacts = records.map((record: any) => ({
      name: cleanQuotes(record.name || record.Name || record["Full Name"] || "Unknown"),
      email: cleanQuotes(record.email || record.Email || record["Email Address"]) || "",
      phone: cleanQuotes(record.phone || record.Phone || record["Phone Number"]) || "",
      category: cleanQuotes(record.category || record.Category) || null,
      birthday: formatBirthday(cleanQuotes(record.birthday || record.Birthday) || null),
      company: cleanQuotes(record.company || record.Company) || null,
      photoUrl: cleanQuotes(record.photoUrl || record.PhotoUrl) || null,
      userId: req.userId!,
    }));

    const created = await prisma.contact.createMany({
      data: contacts,
      skipDuplicates: true,
    });

    await fs.unlink(filePath);
    res.json({ inserted: created.count });
  } catch (err: any) {
    await fs.unlink(filePath);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- vCard Import ----------------
router.post("/vcard", authMiddleware, upload.single("file"), async (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filePath = req.file.path;

  try {
    const content = await fs.readFile(filePath, "utf-8");
    const rawCards = content.split(/(?=BEGIN:VCARD)/).filter(Boolean);
    const parsed = rawCards.flatMap((c) => vCard.parse(c));

    const contacts = parsed.map((c: any) => ({
      name: c.fn?.[0]?.value || "Unknown",
      email: c.email?.[0]?.value || "",
      phone: c.tel?.[0]?.value || "",
      category: c.categories?.[0]?.value || null,
      birthday: formatBirthday(c.bday?.[0]?.value || null),
      company: c.org?.[0]?.value || null,
      photoUrl: c.photo?.[0]?.value || null,
      userId: req.userId!,
    }));

    const created = await prisma.contact.createMany({
      data: contacts,
      skipDuplicates: true,
    });

    await fs.unlink(filePath);
    res.json({ inserted: created.count });
  } catch (err: any) {
    await fs.unlink(filePath);
    res.status(500).json({ error: err.message });
  }
});

export default router;
