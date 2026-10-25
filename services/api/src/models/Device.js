import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  kind: { type: String, required: true, enum: ["temperature", "humidity"] },
  unit: { type: String, required: true, enum: ["C", "%"] },
  warningMin: { type: Number, default: null },
  warningMax: { type: Number, default: null }
}, { _id: false });

const deviceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  organizationId: { type: String, required: true, index: true, ref: "Organization" },
  siteId: { type: String, required: true, ref: "Site" },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  model: { type: String, required: true, trim: true, maxlength: 80 },
  status: { type: String, required: true, enum: ["online", "warning", "offline"], default: "offline" },
  lastSeenAt: { type: Date, default: null },
  deviceKeyHash: { type: String, required: true, select: false },
  sensors: { type: [sensorSchema], validate: [(value) => value.length > 0 && value.length <= 32, "Sensores inválidos"] }
}, { timestamps: true });

deviceSchema.index({ organizationId: 1, siteId: 1 });
export const Device = mongoose.model("Device", deviceSchema);
