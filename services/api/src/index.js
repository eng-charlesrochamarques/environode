import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.port, env.isProduction ? "0.0.0.0" : "127.0.0.1", () => {
  console.log(`Environode API listening on http://localhost:${env.port}`);
});
