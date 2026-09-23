import dotenv from "dotenv";

dotenv.config();

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.API_PORT || 4000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "local-development-secret"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h"
};

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required in production.");
}
