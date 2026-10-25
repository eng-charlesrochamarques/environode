import crypto from "node:crypto";
import { Device } from "../models/Device.js";
import { hashDeviceKey } from "../database/seed.js";
import { HttpError } from "../shared/errors/HttpError.js";

export async function requireDeviceAuth(req, res, next) {
  const deviceId = req.get("X-Device-Id");
  const deviceKey = req.get("X-Device-Key");
  if (!deviceId || !deviceKey || deviceId.length > 100 || deviceKey.length > 256) return next(new HttpError(401, "Credencial do dispositivo inválida."));

  try {
    const device = await Device.findById(deviceId).select("+deviceKeyHash").lean();
    if (!device) return next(new HttpError(401, "Credencial do dispositivo inválida."));
    const actual = Buffer.from(hashDeviceKey(deviceKey), "hex");
    const expected = Buffer.from(device.deviceKeyHash, "hex");
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return next(new HttpError(401, "Credencial do dispositivo inválida."));
    req.device = { ...device, id: String(device._id) };
    return next();
  } catch (error) { return next(error); }
}
