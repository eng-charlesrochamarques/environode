import { seed } from "../../db/seed.js";

export function findUserByEmail(email) {
  return seed.users.find(
    (user) => user.email.toLowerCase() === String(email).toLowerCase()
  );
}

export function findUserById(id) {
  return seed.users.find((user) => user.id === id);
}

export function findOrganizationById(id) {
  return seed.organizations.find((organization) => organization.id === id);
}

export function getSitesByOrganization(organizationId) {
  return seed.sites.filter((site) => site.organizationId === organizationId);
}

export function getDevicesByOrganization(organizationId) {
  return seed.devices.filter((device) => device.organizationId === organizationId);
}

export function getDeviceByOrganization(organizationId, deviceId) {
  const device = seed.devices.find(
    (item) => item.organizationId === organizationId && item.id === deviceId
  );
  if (!device) return null;

  const measurements = getMeasurementsByOrganization(organizationId, deviceId);
  const site = getSitesByOrganization(organizationId).find((item) => item.id === device.siteId);
  return {
    ...device,
    site: site ? { id: site.id, name: site.name, location: site.location } : null,
    sensors: device.sensors.map((sensor) => ({
      ...sensor,
      latestMeasurement: measurements.find((measurement) => measurement.sensorId === sensor.id) || null
    }))
  };
}

export function getMeasurementsByOrganization(organizationId, deviceId) {
  return seed.measurements
    .filter((measurement) => measurement.organizationId === organizationId)
    .filter((measurement) => !deviceId || measurement.deviceId === deviceId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function getAlertsByOrganization(organizationId) {
  return seed.alerts
    .filter((alert) => alert.organizationId === organizationId)
    .map((alert) => ({
      ...alert,
      deviceName: getDevicesByOrganization(organizationId).find((device) => device.id === alert.deviceId)?.name || "Central"
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getDashboardByOrganization(organizationId) {
  const organization = findOrganizationById(organizationId);
  const sites = getSitesByOrganization(organizationId);
  const devices = getDevicesByOrganization(organizationId);
  const alerts = getAlertsByOrganization(organizationId);

  const latestByDevice = devices.map((device) => getDeviceByOrganization(organizationId, device.id));

  return {
    organization,
    totals: {
      sites: sites.length,
      devices: devices.length,
      onlineDevices: devices.filter((device) => device.status === "online").length,
      offlineDevices: devices.filter((device) => device.status === "offline").length,
      activeAlerts: alerts.filter((alert) => alert.status === "active").length
    },
    sites,
    devices: latestByDevice,
    recentAlerts: alerts.slice(0, 5)
  };
}
