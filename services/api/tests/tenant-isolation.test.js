import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApp } from "../src/app.js";

let server;
let baseUrl;
const origin = "http://localhost:5173";

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

async function login(email) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
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
  const response = await fetch(`${baseUrl}${path}`, { headers: { Cookie: cookie } });
  return { status: response.status, body: await response.json() };
}

test("cada cliente recebe apenas seus equipamentos e sensores", async () => {
  const ana = await login("ana@novalab.example");
  const bruno = await login("bruno@circuitoverde.example");

  const [nova, circuito] = await Promise.all([
    get("/api/dashboard", ana), get("/api/dashboard", bruno)
  ]);
  assert.equal(nova.status, 200);
  assert.equal(circuito.status, 200);
  assert.equal(nova.body.devices.length, 10);
  assert.equal(circuito.body.devices.length, 1);
  assert.ok(nova.body.devices.every((device) => device.organizationId === "org-novalab"));
  assert.ok(circuito.body.devices.every((device) => device.organizationId === "org-circuito"));
  assert.equal(nova.body.devices[0].sensors.length, 4);
  assert.ok(nova.body.devices[0].sensors.every((sensor) => sensor.latestMeasurement?.organizationId === "org-novalab"));

  const foreignMeasurements = await get("/api/measurements?deviceId=dev-circuito-01", ana);
  assert.deepEqual(foreignMeasurements.body.measurements, []);
  assert.equal((await get("/api/devices/dev-circuito-01", ana)).status, 404);
  assert.equal((await get("/api/devices/dev-circuito-01", bruno)).status, 200);
  const novaAlerts = await get("/api/alerts", ana);
  assert.ok(novaAlerts.body.alerts.every((alert) => alert.organizationId === "org-novalab"));
  assert.ok(novaAlerts.body.alerts.every((alert) => alert.deviceId.startsWith("dev-novalab-")));
  assert.equal((await get("/api/dashboard", "")).status, 401);
});

test("login rejeita origem externa", async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://example.net" },
    body: JSON.stringify({ email: "ana@novalab.example", password: "demo123" })
  });
  assert.equal(response.status, 403);
});
