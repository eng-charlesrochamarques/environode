import bcrypt from "bcryptjs";

const passwordHash = bcrypt.hashSync("demo123", 10);
const demoTime = new Date().toISOString();

const novalabDevices = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: `dev-novalab-${number}`,
    organizationId: "org-novalab",
    siteId: index < 6 ? "site-novalab-main" : "site-novalab-storage",
    name: `Central ${number}`,
    model: "ENV-SIM-01",
    status: index === 7 ? "warning" : index === 9 ? "offline" : "online",
    lastSeenAt: index === 9 ? null : demoTime,
    sensors: [
      { id: `sensor-novalab-${number}-t1`, name: "Temperatura A", kind: "temperature", unit: "C" },
      { id: `sensor-novalab-${number}-h1`, name: "Umidade A", kind: "humidity", unit: "%" },
      { id: `sensor-novalab-${number}-t2`, name: "Temperatura B", kind: "temperature", unit: "C" },
      { id: `sensor-novalab-${number}-h2`, name: "Umidade B", kind: "humidity", unit: "%" }
    ]
  };
});

const circuitoDevices = [{
  id: "dev-circuito-01",
  organizationId: "org-circuito",
  siteId: "site-circuito-rd",
  name: "Central 01",
  model: "ENV-SIM-01",
  status: "online",
  lastSeenAt: demoTime,
  sensors: [
    { id: "sensor-circuito-01-t1", name: "Temperatura A", kind: "temperature", unit: "C" },
    { id: "sensor-circuito-01-h1", name: "Umidade A", kind: "humidity", unit: "%" }
  ]
}];

const demoDevices = [...novalabDevices, ...circuitoDevices];
const demoMeasurements = demoDevices.flatMap((device, deviceIndex) =>
  device.status === "offline" ? [] : device.sensors.map((sensor, sensorIndex) => ({
    id: `meas-${sensor.id}`,
    organizationId: device.organizationId,
    deviceId: device.id,
    sensorId: sensor.id,
    timestamp: demoTime,
    value: sensor.kind === "temperature"
      ? Number((22 + deviceIndex * 0.3 + sensorIndex * 0.2).toFixed(1))
      : Number((45 + deviceIndex * 1.8 + sensorIndex).toFixed(1))
  }))
);

export const seed = {
  organizations: [
    {
      id: "org-novalab",
      name: "NovaLab Electronics",
      slug: "novalab-electronics"
    },
    {
      id: "org-circuito",
      name: "Circuito Verde Labs",
      slug: "circuito-verde-labs"
    }
  ],
  users: [
    {
      id: "user-novalab-admin",
      organizationId: "org-novalab",
      name: "Ana Pereira",
      email: "ana@novalab.example",
      passwordHash,
      role: "customer_admin"
    },
    {
      id: "user-circuito-admin",
      organizationId: "org-circuito",
      name: "Bruno Lima",
      email: "bruno@circuitoverde.example",
      passwordHash,
      role: "customer_admin"
    }
  ],
  sites: [
    {
      id: "site-novalab-main",
      organizationId: "org-novalab",
      name: "Laboratório principal",
      location: "Sao Paulo, SP"
    },
    {
      id: "site-novalab-storage",
      organizationId: "org-novalab",
      name: "Armazenamento de componentes",
      location: "Sao Paulo, SP"
    },
    {
      id: "site-circuito-rd",
      organizationId: "org-circuito",
      name: "Área de desenvolvimento",
      location: "Campinas, SP"
    },
    {
      id: "site-circuito-warehouse",
      organizationId: "org-circuito",
      name: "Depósito ESD",
      location: "Campinas, SP"
    }
  ],
  devices: demoDevices,
  measurements: demoMeasurements,
  alerts: [
    {
      id: "alert-001",
      organizationId: "org-novalab",
      deviceId: "dev-novalab-08",
      severity: "warning",
      status: "active",
      type: "humidity_high",
      message: "Umidade acima do limite configurado.",
      createdAt: demoTime
    },
    {
      id: "alert-002",
      organizationId: "org-circuito",
      deviceId: "dev-circuito-01",
      severity: "warning",
      status: "active",
      type: "temperature_high",
      message: "Temperatura acima do limite configurado.",
      createdAt: demoTime
    }
  ]
};
