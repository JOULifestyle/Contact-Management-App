import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import Joi from "joi";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import dayjs from "dayjs";
import { v2 as cloudinary } from "cloudinary";

const router = Router();
router.use(authMiddleware);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BASE_URL = process.env.BACKEND_URL || "http://localhost:8000";

// Multer setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Joi validation schema
const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional().allow(null, ""),
  phone: Joi.string().optional().allow(null, ""),
  category: Joi.string().optional().allow(null, ""),
  birthday: Joi.date().optional().allow(null, ""),
  company: Joi.string().optional().allow(null, ""),
  photoUrl: Joi.string().uri().optional().allow(null, ""),
});

// Normalize phone numbers (international, fallback NG)
function normalizePhone(phone?: string) {
  if (!phone) return phone;
  const phoneNumber = parsePhoneNumberFromString(phone, "NG");
  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error("Invalid phone number");
  }
  return phoneNumber.number;
}

// Format birthday consistently
function formatContact(contact: any) {
  return {
    ...contact,
    birthday: contact.birthday
      ? dayjs(contact.birthday).format("YYYY-MM-DD")
      : null,
  };
}

//  Upload route
router.post("/upload", upload.single("avatar"), async (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "contact-avatars" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    const fileUrl = (result as any).secure_url;
    console.log(`File uploaded to Cloudinary: ${fileUrl}`);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

//  List contacts
router.get("/", async (req: AuthRequest, res) => {
  const contacts = await prisma.contact.findMany({
    where: { userId: req.userId },
  });
  res.json(contacts.map(formatContact));
});

//  Create contact
router.post("/", async (req: AuthRequest, res) => {
  const { error, value } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    if (value.phone) value.phone = normalizePhone(value.phone);

    if (value.birthday === "" || value.birthday === null) {
      value.birthday = null;
    } else if (value.birthday) {
      value.birthday = new Date(value.birthday);
    }

    const contact = await prisma.contact.create({
      data: { ...value, userId: req.userId! },
    });
    res.json(formatContact(contact));
  } catch (err: any) {
    if (err.message === "Invalid phone number") {
      return res.status(400).json({ error: "Invalid phone number format" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "You already have a contact with this name, email or phone" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.put("/bulk-tag", async (req: AuthRequest, res) => {
  const { ids, category } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "'ids' must be a non-empty array" });
  }
  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "'category' is required" });
  }

  try {
    const updated = await prisma.contact.updateMany({
      where: {
        id: { in: ids },
        userId: req.userId,
      },
      data: { category },
    });

    res.json({ updated: updated.count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

//  Update contact
router.put("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { error, value } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    if (value.phone) value.phone = normalizePhone(value.phone);

    if (value.birthday === "" || value.birthday === null) {
      value.birthday = null;
    } else if (value.birthday) {
      value.birthday = new Date(value.birthday);
    }

    const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
    if (!contact || contact.userId !== req.userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updated = await prisma.contact.update({
      where: { id: Number(id) },
      data: value,
    });
    res.json(formatContact(updated));
  } catch (err: any) {
    if (err.message === "Invalid phone number") {
      return res.status(400).json({ error: "Invalid phone number format" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email or phone already exists" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

//  Delete contact
router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;

  const contact = await prisma.contact.findUnique({ where: { id: Number(id) } });
  if (!contact || contact.userId !== req.userId) {
    return res.status(403).json({ error: "Not allowed" });
  }

  await prisma.contact.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});


export default router;
