import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    aadhaarNumber: { type: String, required: true },
    aadhaarPdf: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);
