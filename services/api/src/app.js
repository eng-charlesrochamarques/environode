import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { requireAuth } from "./middlewares/requireAuth.js";
import { login, me } from "./modules/auth/auth.controller.js";
import {
  getDashboard,
  listAlerts,
  listDevices,
  listMeasurements,
  listSites
} from "./modules/platform/platform.controller.js";
import { notFoundHandler } from "./shared/errors/notFoundHandler.js";
import { errorHandler } from "./shared/errors/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "32kb" }));
  app.use(morgan("dev"));
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "environode-api" });
  });

  app.post("/api/auth/login", login);
  app.get("/api/auth/me", requireAuth, me);

  app.get("/api/dashboard", requireAuth, getDashboard);
  app.get("/api/sites", requireAuth, listSites);
  app.get("/api/devices", requireAuth, listDevices);
  app.get("/api/measurements", requireAuth, listMeasurements);
  app.get("/api/alerts", requireAuth, listAlerts);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
