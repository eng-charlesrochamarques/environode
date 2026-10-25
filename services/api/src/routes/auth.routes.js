import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireBrowserOrigin } from "../middlewares/requireBrowserOrigin.js";

export const authRouter = Router();
const loginLimiter = rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: true, legacyHeaders: false });

authRouter.post("/login", requireBrowserOrigin, loginLimiter, login);
authRouter.get("/me", requireAuth, me);
authRouter.post("/logout", requireBrowserOrigin, logout);
