import bcrypt from "bcryptjs";

const passwordHash = bcrypt.hashSync("demo123", 10);

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
      name: "Main Electronics Lab",
      location: "Sao Paulo, SP"
    },
    {
      id: "site-novalab-storage",
      organizationId: "org-novalab",
      name: "Component Storage Room",
      location: "Sao Paulo, SP"
    },
    {
      id: "site-circuito-rd",
      organizationId: "org-circuito",
      name: "R&D Bench Area",
      location: "Campinas, SP"
    },
    {
      id: "site-circuito-warehouse",
      organizationId: "org-circuito",
      name: "ESD Warehouse",
      location: "Campinas, SP"
    }
  ],
  devices: [
    {
      id: "dev-novalab-001",
      organizationId: "org-novalab",
      siteId: "site-novalab-main",
      name: "Lab Bench Sensor 01",
      model: "ENV-SIM-01",
      status: "online",
      lastSeenAt: "2026-09-16T18:00:00.000Z"
    },
    {
      id: "dev-novalab-002",
      organizationId: "org-novalab",
      siteId: "site-novalab-storage",
      name: "Storage Humidity Node",
      model: "ENV-SIM-01",
      status: "warning",
      lastSeenAt: "2026-09-16T17:58:30.000Z"
    },
    {
      id: "dev-circuito-001",
      organizationId: "org-circuito",
      siteId: "site-circuito-rd",
      name: "R&D Thermal Monitor",
      model: "ENV-SIM-01",
      status: "online",
      lastSeenAt: "2026-09-16T18:01:10.000Z"
    },
    {
      id: "dev-circuito-002",
      organizationId: "org-circuito",
      siteId: "site-circuito-warehouse",
      name: "Warehouse Sensor 02",
      model: "ENV-SIM-01",
      status: "offline",
      lastSeenAt: "2026-09-16T17:12:00.000Z"
    }
  ],
  measurements: [
    {
      id: "meas-001",
      organizationId: "org-novalab",
      deviceId: "dev-novalab-001",
      timestamp: "2026-09-16T18:00:00.000Z",
      temperatureC: 23.7,
      humidityPercent: 46.2
    },
    {
      id: "meas-002",
      organizationId: "org-novalab",
      deviceId: "dev-novalab-002",
      timestamp: "2026-09-16T17:58:30.000Z",
      temperatureC: 24.8,
      humidityPercent: 68.9
    },
    {
      id: "meas-003",
      organizationId: "org-circuito",
      deviceId: "dev-circuito-001",
      timestamp: "2026-09-16T18:01:10.000Z",
      temperatureC: 22.4,
      humidityPercent: 44.1
    },
    {
      id: "meas-004",
      organizationId: "org-circuito",
      deviceId: "dev-circuito-002",
      timestamp: "2026-09-16T17:12:00.000Z",
      temperatureC: 25.1,
      humidityPercent: 51.5
    }
  ],
  alerts: [
    {
      id: "alert-001",
      organizationId: "org-novalab",
      deviceId: "dev-novalab-002",
      severity: "warning",
      status: "active",
      type: "humidity_high",
      message: "Humidity is above the configured storage limit.",
      createdAt: "2026-09-16T17:58:45.000Z"
    },
    {
      id: "alert-002",
      organizationId: "org-circuito",
      deviceId: "dev-circuito-002",
      severity: "critical",
      status: "active",
      type: "device_offline",
      message: "Device has not reported telemetry within the expected interval.",
      createdAt: "2026-09-16T17:45:00.000Z"
    }
  ]
};
