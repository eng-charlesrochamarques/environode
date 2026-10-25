import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, trim: true, maxlength: 120 }
}, { timestamps: true });

export const Organization = mongoose.model("Organization", organizationSchema);
