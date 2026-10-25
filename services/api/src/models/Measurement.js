import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema({
  organizationId: { type: String, required: true, index: true, ref: "Organization" },
  deviceId: { type: String, required: true, index: true, ref: "Device" },
  sensorId: { type: String, required: true, index: true },
  value: { type: Number, required: true },
  sampledAt: { type: Date, required: true },
  receivedAt: { type: Date, required: true, default: Date.now },
  bootId: { type: String, default: null, maxlength: 64 },
  sequence: { type: Number, default: null, min: 0 }
}, { versionKey: false });

measurementSchema.index({ organizationId: 1, deviceId: 1, sampledAt: -1 });
measurementSchema.index({ deviceId: 1, sensorId: 1, sampledAt: -1 });
measurementSchema.index(
  { deviceId: 1, bootId: 1, sequence: 1, sensorId: 1 },
  { unique: true, partialFilterExpression: { bootId: { $type: "string" }, sequence: { $type: "number" } } }
);

export const Measurement = mongoose.model("Measurement", measurementSchema);
