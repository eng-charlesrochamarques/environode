import dotenv from "dotenv";

dotenv.config();

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  port: Number(process.env.API_PORT || 4000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "local-development-secret"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  databaseMode: process.env.DATABASE_MODE || (process.env.NODE_ENV === "production" ? "external" : "embedded"),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/environode",
  mongodbVersion: process.env.MONGODB_VERSION || "7.0.14",
  demoDeviceKey: process.env.DEMO_DEVICE_KEY || "env-demo-device-key-change-me",
  offlineAfterMs: Number(process.env.DEVICE_OFFLINE_AFTER_MS || 60_000)
};

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required in production.");
}

if (env.isProduction && env.databaseMode !== "external") {
  throw new Error("DATABASE_MODE must be external in production.");
}
