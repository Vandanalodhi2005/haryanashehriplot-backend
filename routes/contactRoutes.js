import express from "express";
import multer from "multer";
import Contact from "../models/contact.js";

const router = express.Router();

/* Storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/contact");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

/* File filter */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

/* POST Contact */
router.post("/", upload.single("aadhaarPdf"), async (req, res) => {
  try {
    const { name, phone, email, aadhaarNumber, message } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aadhaar PDF required" });
    }

    const contact = new Contact({
      name,
      phone,
      email,
      aadhaarNumber,
      message,
      aadhaarPdf: req.file.path,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
