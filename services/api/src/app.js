import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { databaseState } from "./database/connection.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./shared/errors/errorHandler.js";
import { notFoundHandler } from "./shared/errors/notFoundHandler.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: "32kb", strict: true }));
  if (!env.isProduction && !env.isTest) app.use(morgan("dev"));
  app.use(rateLimit({ windowMs: 60_000, limit: 600, standardHeaders: true, legacyHeaders: false }));

  app.get("/health", (req, res) => {
    const database = databaseState();
    res.status(database === "connected" ? 200 : 503).json({ status: database === "connected" ? "ok" : "degraded", service: "environode-api", database });
  });
  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
