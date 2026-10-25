import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  organizationId: { type: String, required: true, index: true, ref: "Organization" },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  location: { type: String, required: true, trim: true, maxlength: 180 }
}, { timestamps: true });

siteSchema.index({ organizationId: 1, name: 1 });
export const Site = mongoose.model("Site", siteSchema);
