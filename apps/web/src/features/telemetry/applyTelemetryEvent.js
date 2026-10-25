function latestMeasurement(event, reading) {
  return {
    id: `live-${event.receivedAt}-${reading.sensorId}`,
    deviceId: event.deviceId,
    sensorId: reading.sensorId,
    value: reading.value,
    timestamp: event.sampledAt,
    sampledAt: event.sampledAt,
    receivedAt: event.receivedAt
  };
}

function updateDevice(device, event) {
  if (device.id !== event.deviceId) return device;
  const readings = new Map(event.readings.map((reading) => [reading.sensorId, reading]));
  return {
    ...device,
    status: event.status || "online",
    lastSeenAt: event.receivedAt,
    sensors: device.sensors.map((sensor) => {
      const reading = readings.get(sensor.id);
      return reading ? { ...sensor, latestMeasurement: latestMeasurement(event, reading) } : sensor;
    })
  };
}

export function applyTelemetryToDashboard(data, event) {
  const previous = data.devices.find((device) => device.id === event.deviceId);
  if (!previous) return data;
  const nextStatus = event.status || "online";
  const wasOnline = previous.status === "online";
  const wasOffline = previous.status === "offline";
  const isOnline = nextStatus === "online";
  const isOffline = nextStatus === "offline";

  return {
    ...data,
    totals: {
      ...data.totals,
      onlineDevices: data.totals.onlineDevices + Number(isOnline) - Number(wasOnline),
      offlineDevices: data.totals.offlineDevices + Number(isOffline) - Number(wasOffline)
    },
    devices: data.devices.map((device) => updateDevice(device, event))
  };
}

export function applyTelemetryToDevice(data, event, historyLimit = 100) {
  if (data.device.id !== event.deviceId) return data;
  const measurements = event.readings.map((reading) => latestMeasurement(event, reading));
  return {
    ...data,
    device: updateDevice(data.device, event),
    measurements: [...measurements, ...data.measurements].slice(0, historyLimit)
  };
}
