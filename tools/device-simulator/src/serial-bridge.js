import { SerialPort } from "serialport";
import { randomUUID } from "node:crypto";

const portPath = process.env.SERIAL_PORT || "COM5";
const baudRate = Number(process.env.SERIAL_BAUD || 115200);
const apiUrl = process.env.API_URL || "http://localhost:4000";
const deviceId = process.env.DEVICE_ID || "dev-novalab-01";
const deviceKey = process.env.DEVICE_KEY || "env-demo-device-key-change-me";
let buffer = "";
let queue = Promise.resolve();
let bridgeSequence = 0;
const bridgeBootId = `serial-${randomUUID()}`;

async function forward(line) {
  let payload;
  try { payload = JSON.parse(line); }
  catch { throw new Error("linha serial não contém JSON válido"); }
  payload.bootId ??= bridgeBootId;
  payload.sequence ??= bridgeSequence++;
  const response = await fetch(`${apiUrl}/api/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Device-Id": deviceId, "X-Device-Key": deviceKey },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
  console.log(`[${new Date().toLocaleTimeString("pt-BR")}] sequência ${payload.sequence ?? "-"} encaminhada`);
}

const port = new SerialPort({ path: portPath, baudRate, dataBits: 8, parity: "none", stopBits: 1 });
port.on("open", () => console.log(`Bridge conectado a ${portPath} em ${baudRate} baud.`));
port.on("data", (chunk) => {
  buffer += chunk.toString("utf8");
  let newline;
  while ((newline = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (line) queue = queue.then(() => forward(line)).catch((error) => console.error(`Linha rejeitada: ${error.message}`));
  }
  if (buffer.length > 8192) buffer = "";
});
port.on("error", (error) => { console.error(`Erro serial: ${error.message}`); process.exitCode = 1; });
process.on("SIGINT", () => port.close(() => process.exit(0)));
