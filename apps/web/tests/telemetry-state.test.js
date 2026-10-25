import assert from "node:assert/strict";
import test from "node:test";
import { applyTelemetryToDashboard, applyTelemetryToDevice } from "../src/features/telemetry/applyTelemetryEvent.js";

const event = {
  deviceId: "device-1",
  status: "online",
  sampledAt: "2026-10-25T18:00:00.000Z",
  receivedAt: "2026-10-25T18:00:00.100Z",
  readings: [{ sensorId: "temperature-1", value: 23.4 }]
};

function device(id, status = "offline") {
  return {
    id,
    status,
    sensors: [
      { id: "temperature-1", latestMeasurement: null },
      { id: "humidity-1", latestMeasurement: null }
    ]
  };
}

test("atualiza somente a central e o sensor presentes no evento", () => {
  const changed = device("device-1");
  const untouched = device("device-2", "online");
  const data = { totals: { onlineDevices: 1, offlineDevices: 1 }, devices: [changed, untouched] };
  const result = applyTelemetryToDashboard(data, event);

  assert.notEqual(result.devices[0], changed);
  assert.equal(result.devices[1], untouched);
  assert.notEqual(result.devices[0].sensors[0], changed.sensors[0]);
  assert.equal(result.devices[0].sensors[1], changed.sensors[1]);
  assert.equal(result.totals.onlineDevices, 2);
  assert.equal(result.totals.offlineDevices, 0);
});

test("acrescenta o histórico sem recarregar os dados do equipamento", () => {
  const currentDevice = device("device-1");
  const previous = { id: "old", sensorId: "humidity-1", value: 50 };
  const result = applyTelemetryToDevice({ device: currentDevice, measurements: [previous] }, event, 2);

  assert.equal(result.measurements.length, 2);
  assert.equal(result.measurements[0].value, 23.4);
  assert.equal(result.measurements[1], previous);
  assert.equal(result.device.lastSeenAt, event.receivedAt);
});
