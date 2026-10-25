import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { platformRouter } from "./platform.routes.js";
import { telemetryRouter } from "./telemetry.routes.js";

export const apiRouter = Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/telemetry", telemetryRouter);
apiRouter.use(platformRouter);
