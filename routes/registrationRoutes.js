import express from "express";
import multer from "multer";
import Registration from "../models/Registration.js";

const router = express.Router();

/* Storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/aadhaar");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

/* File Filter */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

/* POST Registration */
router.post("/", upload.single("aadhaarPdf"), async (req, res) => {
  try {
    const { fullName, phone, email, aadhaarNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aadhaar PDF required" });
    }

    const newRegistration = new Registration({
      fullName,
      phone,
      email,
      aadhaarNumber,
      aadhaarPdf: req.file.path,
    });

    await newRegistration.save();

    res.status(201).json({
      success: true,
      message: "Registration submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
