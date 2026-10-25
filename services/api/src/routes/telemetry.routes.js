import { Router } from "express";
import rateLimit from "express-rate-limit";
import { receiveTelemetry } from "../controllers/telemetry.controller.js";
import { requireDeviceAuth } from "../middlewares/requireDeviceAuth.js";

export const telemetryRouter = Router();
const telemetryLimiter = rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false });
telemetryRouter.post("/", telemetryLimiter, requireDeviceAuth, receiveTelemetry);
