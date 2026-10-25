import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { env } from "../config/env.js";

let embeddedServer;
const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export async function connectDatabase(uri = env.mongodbUri) {
  let targetUri = uri;

  if (env.databaseMode === "embedded" && !env.isTest && uri === env.mongodbUri) {
    process.env.MONGOMS_DOWNLOAD_DIR ||= path.resolve(apiRoot, ".data", "mongodb-binaries");
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const dbPath = path.resolve(apiRoot, ".data", "mongodb");
    await fs.mkdir(dbPath, { recursive: true });
    embeddedServer = await MongoMemoryServer.create({
      binary: { version: env.mongodbVersion },
      instance: { dbName: "environode", dbPath, storageEngine: "wiredTiger" }
    });
    targetUri = embeddedServer.getUri("environode");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 10_000 });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (embeddedServer) {
    await embeddedServer.stop({ doCleanup: false });
    embeddedServer = undefined;
  }
}

export function databaseState() {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
}
