import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { Alert } from "../models/Alert.js";
import { Device } from "../models/Device.js";
import { Measurement } from "../models/Measurement.js";
import { Organization } from "../models/Organization.js";
import { Site } from "../models/Site.js";
import { User } from "../models/User.js";

export function hashDeviceKey(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function makeSensors(prefix, count = 2) {
  return Array.from({ length: count }, (_, index) => {
    const channel = index + 1;
    return [
      { id: `${prefix}-t${channel}`, name: `Temperatura ${channel}`, kind: "temperature", unit: "C", warningMin: 15, warningMax: 30 },
      { id: `${prefix}-h${channel}`, name: `Umidade ${channel}`, kind: "humidity", unit: "%", warningMin: 30, warningMax: 65 }
    ];
  }).flat();
}

function makeDevices() {
  const novalab = Array.from({ length: 10 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      _id: `dev-novalab-${number}`,
      organizationId: "org-novalab",
      siteId: index < 6 ? "site-novalab-main" : "site-novalab-storage",
      name: `Central ${number}`,
      model: index === 0 ? "NUCLEO-H753ZI" : "ENV-SIM-01",
      status: "offline",
      lastSeenAt: null,
      deviceKeyHash: hashDeviceKey(env.demoDeviceKey),
      sensors: makeSensors(`sensor-novalab-${number}`)
    };
  });

  return [...novalab, {
    _id: "dev-circuito-01",
    organizationId: "org-circuito",
    siteId: "site-circuito-rd",
    name: "Central 01",
    model: "ENV-SIM-01",
    status: "offline",
    lastSeenAt: null,
    deviceKeyHash: hashDeviceKey(env.demoDeviceKey),
    sensors: makeSensors("sensor-circuito-01", 1)
  }];
}

export async function seedDatabase({ force = false } = {}) {
  if (force) {
    await Promise.all([
      Alert.deleteMany({}), Device.deleteMany({}), Measurement.deleteMany({}),
      Organization.deleteMany({}), Site.deleteMany({}), User.deleteMany({})
    ]);
  } else if (await Organization.exists({})) {
    return;
  }

  const passwordHash = await bcrypt.hash("demo123", 12);
  await Organization.insertMany([
    { _id: "org-novalab", name: "NovaLab Electronics", slug: "novalab-electronics" },
    { _id: "org-circuito", name: "Circuito Verde Labs", slug: "circuito-verde-labs" }
  ]);
  await User.insertMany([
    { _id: "user-novalab-admin", organizationId: "org-novalab", name: "Ana Pereira", email: "ana@novalab.example", passwordHash, role: "customer_admin" },
    { _id: "user-circuito-admin", organizationId: "org-circuito", name: "Bruno Lima", email: "bruno@circuitoverde.example", passwordHash, role: "customer_admin" }
  ]);
  await Site.insertMany([
    { _id: "site-novalab-main", organizationId: "org-novalab", name: "Laboratório principal", location: "São Paulo, SP" },
    { _id: "site-novalab-storage", organizationId: "org-novalab", name: "Armazenamento de componentes", location: "São Paulo, SP" },
    { _id: "site-circuito-rd", organizationId: "org-circuito", name: "Área de desenvolvimento", location: "Campinas, SP" },
    { _id: "site-circuito-warehouse", organizationId: "org-circuito", name: "Depósito ESD", location: "Campinas, SP" }
  ]);
  await Device.insertMany(makeDevices());
}
