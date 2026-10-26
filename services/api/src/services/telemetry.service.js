import { Alert } from "../models/Alert.js";
import { Device } from "../models/Device.js";
import { Measurement } from "../models/Measurement.js";
import { HttpError } from "../shared/errors/HttpError.js";
import { publish } from "./realtime.service.js";

function validatePayload(device, body) {
  if (!body || !Array.isArray(body.readings) || body.readings.length < 1 || body.readings.length > 32) {
    throw new HttpError(400, "O payload deve conter de 1 a 32 leituras.");
  }
  if (body.bootId != null && (typeof body.bootId !== "string" || !/^[A-Za-z0-9._-]{1,64}$/.test(body.bootId))) {
    throw new HttpError(400, "bootId inválido.");
  }
  if (body.sequence != null && (!Number.isSafeInteger(body.sequence) || body.sequence < 0)) {
    throw new HttpError(400, "sequence inválida.");
  }
  const sampledAt = body.sampledAt ? new Date(body.sampledAt) : new Date();
  if (Number.isNaN(sampledAt.getTime()) || sampledAt.getTime() > Date.now() + 300_000) {
    throw new HttpError(400, "sampledAt inválido.");
  }
  const sensors = new Map(device.sensors.map((sensor) => [sensor.id, sensor]));
  const seen = new Set();
  const readings = body.readings.map((reading) => {
    const sensor = sensors.get(reading?.sensorId);
    if (!sensor || seen.has(reading.sensorId) || !Number.isFinite(reading.value)) throw new HttpError(400, "Leitura de sensor inválida.");
    if (sensor.kind === "humidity" && (reading.value < 0 || reading.value > 100)) throw new HttpError(400, "Umidade fora do intervalo físico.");
    if (sensor.kind === "temperature" && (reading.value < -100 || reading.value > 200)) throw new HttpError(400, "Temperatura fora do intervalo físico.");
    seen.add(reading.sensorId);
    return { sensor, value: reading.value };
  });
  return { sampledAt, readings, bootId: body.bootId || null, sequence: body.sequence ?? null };
}

async function updateAlerts(device, readings, now) {
  let warning = false;
  for (const { sensor, value } of readings) {
    const below = sensor.warningMin != null && value < sensor.warningMin;
    const above = sensor.warningMax != null && value > sensor.warningMax;
    const type = below ? `${sensor.kind}_low` : above ? `${sensor.kind}_high` : null;
    if (type) {
      warning = true;
      await Alert.updateOne(
        { organizationId: device.organizationId, deviceId: device.id, sensorId: sensor.id, type, status: "active" },
        { $setOnInsert: { severity: "warning", message: `${sensor.name} fora do limite configurado.`, createdAt: now } },
        { upsert: true }
      );
    } else {
      await Alert.updateMany(
        { organizationId: device.organizationId, deviceId: device.id, sensorId: sensor.id, status: "active" },
        { $set: { status: "resolved", resolvedAt: now } }
      );
    }
  }
  return warning;
}

export async function ingestTelemetry(device, body) {
  const { sampledAt, readings, bootId, sequence } = validatePayload(device, body);
  if (bootId && sequence != null && await Measurement.exists({ deviceId: device.id, bootId, sequence })) {
    return { accepted: false, duplicate: true, receivedAt: new Date() };
  }

  const receivedAt = new Date();
  const documents = readings.map(({ sensor, value }) => ({
    organizationId: device.organizationId, deviceId: device.id, sensorId: sensor.id,
    value, sampledAt, receivedAt, bootId, sequence
  }));
  try {
    await Measurement.insertMany(documents, { ordered: true });
  } catch (error) {
    if (error?.code === 11000) return { accepted: false, duplicate: true, receivedAt };
    throw error;
  }

  const warning = await updateAlerts(device, readings, receivedAt);
  await Device.updateOne({ _id: device.id }, { $set: { lastSeenAt: receivedAt, status: warning ? "warning" : "online" } });
  const activeAlerts = await Alert.countDocuments({ organizationId: device.organizationId, status: "active" });
  const event = {
    deviceId: device.id,
    status: warning ? "warning" : "online",
    activeAlerts,
    sampledAt,
    receivedAt,
    readings: readings.map(({ sensor, value }) => ({ sensorId: sensor.id, value }))
  };
  publish(device.organizationId, "telemetry", event);
  return { accepted: true, duplicate: false, ...event };
}
