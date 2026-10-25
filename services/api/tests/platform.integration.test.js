import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "integration-test-secret-at-least-32-characters";
process.env.MONGOMS_DOWNLOAD_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.data/mongodb-binaries");

let mongo;
let mongoUri;
let server;
let baseUrl;
let connectDatabase;
let disconnectDatabase;
const origin = "http://localhost:5173";

before(async () => {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongo = await MongoMemoryServer.create({ binary: { version: "7.0.14" }, instance: { dbName: "environode-test", storageEngine: "wiredTiger" } });
  mongoUri = mongo.getUri("environode-test");
  ({ connectDatabase, disconnectDatabase } = await import("../src/database/connection.js"));
  const [{ seedDatabase }, { createApp }] = await Promise.all([
    import("../src/database/seed.js"), import("../src/app.js")
  ]);
  await connectDatabase(mongoUri);
  await seedDatabase({ force: true });
  server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server?.close(resolve));
  await disconnectDatabase();
  await mongo?.stop();
});

async function login(email) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ email, password: "demo123" })
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.token, undefined);
  const setCookie = response.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Strict/);
  return setCookie.split(";")[0];
}

async function get(path, cookie) {
  const response = await fetch(`${baseUrl}${path}`, { headers: cookie ? { Cookie: cookie } : {} });
  return { status: response.status, body: await response.json() };
}

async function telemetry(payload, key = "env-demo-device-key-change-me") {
  const response = await fetch(`${baseUrl}/api/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Device-Id": "dev-novalab-01", "X-Device-Key": key },
    body: JSON.stringify(payload)
  });
  return { status: response.status, body: await response.json() };
}

test("cada cliente recebe apenas seus equipamentos", async () => {
  const ana = await login("ana@novalab.example");
  const bruno = await login("bruno@circuitoverde.example");
  const [nova, circuito] = await Promise.all([get("/api/dashboard", ana), get("/api/dashboard", bruno)]);
  assert.equal(nova.status, 200);
  assert.equal(circuito.status, 200);
  assert.equal(nova.body.devices.length, 10);
  assert.equal(circuito.body.devices.length, 1);
  assert.ok(nova.body.devices.every((device) => device.organizationId === "org-novalab"));
  assert.ok(circuito.body.devices.every((device) => device.organizationId === "org-circuito"));
  assert.equal((await get("/api/devices/dev-circuito-01", ana)).status, 404);
  assert.equal((await get("/api/devices/dev-circuito-01", bruno)).status, 200);
  assert.equal((await get("/api/dashboard", "")).status, 401);
});

test("telemetria autentica, persiste e ignora repetição", async () => {
  const payload = {
    bootId: "integration-boot", sequence: 42, sampledAt: new Date().toISOString(),
    readings: [
      { sensorId: "sensor-novalab-01-t1", value: 24.5 },
      { sensorId: "sensor-novalab-01-h1", value: 51.2 }
    ]
  };
  assert.equal((await telemetry(payload, "wrong-key")).status, 401);
  const first = await telemetry(payload);
  assert.equal(first.status, 202);
  assert.equal(first.body.accepted, true);
  const duplicate = await telemetry(payload);
  assert.equal(duplicate.status, 200);
  assert.equal(duplicate.body.duplicate, true);

  const ana = await login("ana@novalab.example");
  const bruno = await login("bruno@circuitoverde.example");
  const measurements = await get("/api/devices/dev-novalab-01/measurements", ana);
  assert.equal(measurements.body.measurements.length, 2);
  assert.equal((await get("/api/devices/dev-novalab-01/measurements", bruno)).status, 404);

  await disconnectDatabase();
  await connectDatabase(mongoUri);
  const afterRestart = await get("/api/devices/dev-novalab-01/measurements", ana);
  assert.equal(afterRestart.body.measurements.length, 2);
});

test("telemetria valida sensores e limites físicos", async () => {
  const invalidSensor = await telemetry({ bootId: "invalid", sequence: 1, readings: [{ sensorId: "foreign", value: 10 }] });
  assert.equal(invalidSensor.status, 400);
  const invalidHumidity = await telemetry({ bootId: "invalid", sequence: 2, readings: [{ sensorId: "sensor-novalab-01-h1", value: 150 }] });
  assert.equal(invalidHumidity.status, 400);
});

test("evento SSE informa nova telemetria ao cliente correto", async () => {
  const ana = await login("ana@novalab.example");
  const controller = new AbortController();
  const stream = await fetch(`${baseUrl}/api/events`, { headers: { Cookie: ana }, signal: controller.signal });
  assert.equal(stream.status, 200);
  const reader = stream.body.getReader();
  const decoder = new TextDecoder();
  let received = "";
  received += decoder.decode((await reader.read()).value, { stream: true });
  const sent = await telemetry({
    bootId: "sse-boot", sequence: 1, sampledAt: new Date().toISOString(),
    readings: [{ sensorId: "sensor-novalab-01-t1", value: 25.1 }]
  });
  assert.equal(sent.status, 202);
  const deadline = Date.now() + 3_000;
  while (!received.includes("event: telemetry") && Date.now() < deadline) {
    const chunk = await reader.read();
    if (chunk.done) break;
    received += decoder.decode(chunk.value, { stream: true });
  }
  controller.abort();
  assert.match(received, /event: telemetry/);
  assert.match(received, /dev-novalab-01/);
});

test("login rejeita origem externa", async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "https://example.net" },
    body: JSON.stringify({ email: "ana@novalab.example", password: "demo123" })
  });
  assert.equal(response.status, 403);
});
