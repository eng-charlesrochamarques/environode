import crypto from "node:crypto";

function argument(name, fallback) {
  const prefix = `--${name}=`;
  const value = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const apiUrl = process.env.API_URL || "http://localhost:4000";
const deviceId = argument("device", process.env.DEVICE_ID || "dev-novalab-01");
const deviceKey = process.env.DEVICE_KEY || "env-demo-device-key-change-me";
const intervalMs = Math.max(Number(argument("interval", process.env.TELEMETRY_INTERVAL_MS || 2_000)), 500);
const sensorCount = Math.max(Number(argument("sensor-count", process.env.SENSOR_COUNT || 2)), 1);
const sensorPrefix = argument("sensor-prefix", process.env.SENSOR_PREFIX || deviceId.replace(/^dev-/, "sensor-"));
const mode = argument("mode", process.env.SIMULATION_MODE || "normal");
const bootId = process.env.BOOT_ID || crypto.randomUUID();
let sequence = 0;

function drift(center, amplitude) {
  return Number((center + (Math.random() - 0.5) * amplitude).toFixed(2));
}

function simulatedReadings() {
  return Array.from({ length: sensorCount }, (_, index) => {
    const channel = index + 1;
    const alertMode = mode === "alert";
    return [
      { sensorId: `${sensorPrefix}-t${channel}`, value: drift(alertMode ? 34 : 23.5 + index * 0.7, alertMode ? 1 : 2.4) },
      { sensorId: `${sensorPrefix}-h${channel}`, value: drift(alertMode ? 72 : 48 + index * 2, alertMode ? 2 : 6) }
    ];
  }).flat();
}

async function sendTelemetry() {
  const payload = {
    bootId,
    sequence: sequence++,
    sampledAt: new Date().toISOString(),
    readings: simulatedReadings()
  };
  const response = await fetch(`${apiUrl}/api/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Device-Id": deviceId, "X-Device-Key": deviceKey },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
  console.log(`[${new Date().toLocaleTimeString("pt-BR")}] ${deviceId} sequencia ${payload.sequence} aceita (${mode})`);
}

console.log(`Simulando ${deviceId} no modo ${mode} a cada ${intervalMs} ms. Pressione Ctrl+C para parar.`);
await sendTelemetry();
const timer = setInterval(() => sendTelemetry().catch((error) => console.error(`Falha de telemetria: ${error.message}`)), intervalMs);
process.on("SIGINT", () => { clearInterval(timer); process.exit(0); });
