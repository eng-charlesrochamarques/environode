import crypto from "node:crypto";

const apiUrl = process.env.API_URL || "http://localhost:4000";
const deviceId = process.env.DEVICE_ID || "dev-novalab-01";
const deviceKey = process.env.DEVICE_KEY || "env-demo-device-key-change-me";
const intervalMs = Math.max(Number(process.env.TELEMETRY_INTERVAL_MS || 2_000), 500);
const bootId = process.env.BOOT_ID || crypto.randomUUID();
let sequence = 0;

function drift(center, amplitude) {
  return Number((center + (Math.random() - 0.5) * amplitude).toFixed(2));
}

async function sendTelemetry() {
  const payload = {
    bootId,
    sequence: sequence++,
    sampledAt: new Date().toISOString(),
    readings: [
      { sensorId: "sensor-novalab-01-t1", value: drift(23.5, 2.4) },
      { sensorId: "sensor-novalab-01-h1", value: drift(48, 6) },
      { sensorId: "sensor-novalab-01-t2", value: drift(24.2, 2.2) },
      { sensorId: "sensor-novalab-01-h2", value: drift(50, 7) }
    ]
  };
  const response = await fetch(`${apiUrl}/api/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Device-Id": deviceId, "X-Device-Key": deviceKey },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
  console.log(`[${new Date().toLocaleTimeString("pt-BR")}] ${deviceId} sequência ${payload.sequence} aceita`);
}

console.log(`Simulando ${deviceId} a cada ${intervalMs} ms. Pressione Ctrl+C para parar.`);
await sendTelemetry();
const timer = setInterval(() => sendTelemetry().catch((error) => console.error(`Falha de telemetria: ${error.message}`)), intervalMs);
process.on("SIGINT", () => { clearInterval(timer); process.exit(0); });
