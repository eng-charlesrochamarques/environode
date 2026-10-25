import { env } from "../config/env.js";
import { Alert } from "../models/Alert.js";
import { Device } from "../models/Device.js";
import { Measurement } from "../models/Measurement.js";
import { Organization } from "../models/Organization.js";
import { Site } from "../models/Site.js";

function idOf(document) {
  return String(document._id);
}

function currentStatus(device) {
  if (!device.lastSeenAt || Date.now() - new Date(device.lastSeenAt).getTime() > env.offlineAfterMs) return "offline";
  return device.status;
}

function measurementDto(measurement) {
  return {
    id: idOf(measurement), organizationId: measurement.organizationId,
    deviceId: measurement.deviceId, sensorId: measurement.sensorId,
    value: measurement.value, timestamp: measurement.sampledAt,
    sampledAt: measurement.sampledAt, receivedAt: measurement.receivedAt,
    bootId: measurement.bootId, sequence: measurement.sequence
  };
}

function deviceDto(device, site, latestBySensor = new Map()) {
  return {
    id: idOf(device), organizationId: device.organizationId, siteId: device.siteId,
    name: device.name, model: device.model, status: currentStatus(device),
    lastSeenAt: device.lastSeenAt,
    site: site ? { id: idOf(site), name: site.name, location: site.location } : null,
    sensors: device.sensors.map((sensor) => ({
      id: sensor.id, name: sensor.name, kind: sensor.kind, unit: sensor.unit,
      warningMin: sensor.warningMin, warningMax: sensor.warningMax,
      latestMeasurement: latestBySensor.get(sensor.id) || null
    }))
  };
}

async function latestMeasurements(organizationId, deviceIds) {
  if (!deviceIds.length) return new Map();
  const rows = await Measurement.aggregate([
    { $match: { organizationId, deviceId: { $in: deviceIds } } },
    { $sort: { sampledAt: -1 } },
    { $group: { _id: { deviceId: "$deviceId", sensorId: "$sensorId" }, row: { $first: "$$ROOT" } } }
  ]);
  return new Map(rows.map(({ _id, row }) => [`${_id.deviceId}:${_id.sensorId}`, measurementDto(row)]));
}

export async function findOrganization(organizationId) {
  const organization = await Organization.findById(organizationId).lean();
  return organization ? { id: idOf(organization), name: organization.name, slug: organization.slug } : null;
}

export async function listSites(organizationId) {
  const sites = await Site.find({ organizationId }).sort({ name: 1 }).lean();
  return sites.map((site) => ({ id: idOf(site), organizationId, name: site.name, location: site.location }));
}

export async function listDevices(organizationId) {
  const [devices, sites] = await Promise.all([
    Device.find({ organizationId }).sort({ name: 1 }).lean(),
    Site.find({ organizationId }).lean()
  ]);
  const latest = await latestMeasurements(organizationId, devices.map(idOf));
  const siteMap = new Map(sites.map((site) => [idOf(site), site]));
  return devices.map((device) => {
    const bySensor = new Map(device.sensors.map((sensor) => [sensor.id, latest.get(`${idOf(device)}:${sensor.id}`) || null]));
    return deviceDto(device, siteMap.get(device.siteId), bySensor);
  });
}

export async function findDevice(organizationId, deviceId) {
  const device = await Device.findOne({ _id: deviceId, organizationId }).lean();
  if (!device) return null;
  const [site, latest] = await Promise.all([
    Site.findOne({ _id: device.siteId, organizationId }).lean(),
    latestMeasurements(organizationId, [deviceId])
  ]);
  const bySensor = new Map(device.sensors.map((sensor) => [sensor.id, latest.get(`${deviceId}:${sensor.id}`) || null]));
  return deviceDto(device, site, bySensor);
}

export async function dashboard(organizationId) {
  const [organization, sites, devices, activeAlerts] = await Promise.all([
    findOrganization(organizationId), listSites(organizationId), listDevices(organizationId),
    Alert.countDocuments({ organizationId, status: "active" })
  ]);
  return {
    organization,
    totals: {
      sites: sites.length, devices: devices.length,
      onlineDevices: devices.filter((device) => device.status === "online").length,
      offlineDevices: devices.filter((device) => device.status === "offline").length,
      activeAlerts
    },
    sites, devices
  };
}

export async function listMeasurements(organizationId, { deviceId, sensorId, from, to, limit = 200 } = {}) {
  const query = { organizationId };
  if (deviceId) query.deviceId = deviceId;
  if (sensorId) query.sensorId = sensorId;
  if (from || to) {
    query.sampledAt = {};
    if (from) query.sampledAt.$gte = new Date(from);
    if (to) query.sampledAt.$lte = new Date(to);
  }
  const rows = await Measurement.find(query).sort({ sampledAt: -1 }).limit(Math.min(Number(limit) || 200, 1000)).lean();
  return rows.map(measurementDto);
}

export async function listAlerts(organizationId) {
  const [alerts, devices] = await Promise.all([
    Alert.find({ organizationId }).sort({ createdAt: -1 }).limit(200).lean(),
    Device.find({ organizationId }).select({ name: 1 }).lean()
  ]);
  const names = new Map(devices.map((device) => [idOf(device), device.name]));
  return alerts.map((alert) => ({
    id: idOf(alert), organizationId, deviceId: alert.deviceId, sensorId: alert.sensorId,
    deviceName: names.get(alert.deviceId) || "Central", severity: alert.severity,
    status: alert.status, type: alert.type, message: alert.message,
    createdAt: alert.createdAt, resolvedAt: alert.resolvedAt
  }));
}
