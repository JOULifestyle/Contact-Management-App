import express from "express";
import multer from "multer";
import { parse } from "csv-parse";
import type { Parser } from "csv-parse";
import fs from "fs/promises";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
const vCard = require("vcard-parser");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Helper to clean quotes from CSV headers/values
function cleanQuotes(str: string | undefined) {
  if (!str) return "";
  return str.replace(/^"(.*)"$/s, "$1").trim();
}

//  CSV Import 
router.post("/csv", authMiddleware, upload.single("file"), async (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filePath = req.file.path;
  const contacts: any[] = [];

  const parser: Parser = parse({ columns: true, skip_empty_lines: true, trim: true });

  try {
    const stream = fs.readFile(filePath, "utf-8");
    const csvContent = await stream;
    parser.write(csvContent);
    parser.end();

    parser.on("readable", () => {
      let record;
      while ((record = parser.read())) {
        contacts.push({
          name: cleanQuotes(record.name || record.Name || record["Full Name"] || ""),
          email: cleanQuotes(record.email || record.Email || record["Email Address"] || null),
          phone: cleanQuotes(record.phone || record.Phone || record["Phone Number"] || null),
          category: cleanQuotes(record.category) || record.Category || null,
          birthday: cleanQuotes(record.birthday || record.Birthday) || null,
          company: cleanQuotes(record.company || record.Company) || null,
          photoUrl: cleanQuotes(record.photoUrl || record.PhotoUrl) || null,
          userId: req.userId!,
        });
      }
    });

    parser.on("error", async (err) => {
      await fs.unlink(filePath);
      res.status(400).json({ error: "CSV parse error: " + err.message });
    });

    parser.on("end", async () => {
      try {
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
  } catch (err: any) {
    await fs.unlink(filePath);
    res.status(500).json({ error: err.message });
  }
});

// vCard Import 
router.post("/vcard", authMiddleware, upload.single("file"), async (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filePath = req.file.path;

  try {
    const content = await fs.readFile(filePath, "utf-8");

    // Split multiple vCards to ensure all are parsed
    const rawCards = content.split(/(?=BEGIN:VCARD)/).filter(Boolean);
    const parsed = rawCards.flatMap((c) => vCard.parse(c));

    const contacts = parsed.map((c: any) => ({
      name: c.fn?.[0]?.value || "Unknown",
      email: c.email?.[0]?.value || null,
      phone: c.tel?.[0]?.value || null,
      category: c.categories?.[0]?.value || null,
      birthday: c.bday?.[0]?.value || null,
      company: c.org?.[0]?.value || null,
      photoUrl: c.photo?.[0]?.value || null, // should now work if export uses PHOTO;VALUE=URI
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
