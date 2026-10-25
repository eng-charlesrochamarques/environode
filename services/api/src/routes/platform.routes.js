import { Router } from "express";
import { streamEvents } from "../controllers/events.controller.js";
import {
  getDashboard, getDevice, listAlerts, listDeviceMeasurements,
  listDevices, listMeasurements, listSites
} from "../controllers/platform.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const platformRouter = Router();
platformRouter.use(requireAuth);
platformRouter.get("/events", streamEvents);
platformRouter.get("/dashboard", getDashboard);
platformRouter.get("/sites", listSites);
platformRouter.get("/devices", listDevices);
platformRouter.get("/devices/:deviceId/measurements", listDeviceMeasurements);
platformRouter.get("/devices/:deviceId", getDevice);
platformRouter.get("/measurements", listMeasurements);
platformRouter.get("/alerts", listAlerts);
