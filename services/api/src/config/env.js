import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.API_PORT || 4000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "local-development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h"
};
