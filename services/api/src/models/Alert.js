import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  organizationId: { type: String, required: true, index: true, ref: "Organization" },
  deviceId: { type: String, required: true, index: true, ref: "Device" },
  sensorId: { type: String, default: null },
  severity: { type: String, required: true, enum: ["warning", "critical"] },
  status: { type: String, required: true, enum: ["active", "resolved"], default: "active" },
  type: { type: String, required: true, maxlength: 80 },
  message: { type: String, required: true, maxlength: 300 },
  createdAt: { type: Date, required: true, default: Date.now },
  resolvedAt: { type: Date, default: null }
}, { versionKey: false });

alertSchema.index({ organizationId: 1, status: 1, createdAt: -1 });
export const Alert = mongoose.model("Alert", alertSchema);
