import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./database/connection.js";
import { seedDatabase } from "./database/seed.js";

await connectDatabase();
await seedDatabase();
const app = createApp();

const server = app.listen(env.port, env.isProduction ? "0.0.0.0" : "127.0.0.1", () => {
  console.log(`Environode API listening on http://localhost:${env.port}`);
});

async function shutdown() {
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
