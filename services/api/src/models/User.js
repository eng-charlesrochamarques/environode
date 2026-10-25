import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  organizationId: { type: String, required: true, index: true, ref: "Organization" },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, required: true, enum: ["customer_admin", "customer_viewer"] }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
