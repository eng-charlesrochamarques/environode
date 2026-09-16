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

export function getMeasurementsByOrganization(organizationId, deviceId) {
  return seed.measurements
    .filter((measurement) => measurement.organizationId === organizationId)
    .filter((measurement) => !deviceId || measurement.deviceId === deviceId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function getAlertsByOrganization(organizationId) {
  return seed.alerts
    .filter((alert) => alert.organizationId === organizationId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getDashboardByOrganization(organizationId) {
  const organization = findOrganizationById(organizationId);
  const sites = getSitesByOrganization(organizationId);
  const devices = getDevicesByOrganization(organizationId);
  const measurements = getMeasurementsByOrganization(organizationId);
  const alerts = getAlertsByOrganization(organizationId);

  const latestByDevice = devices.map((device) => {
    const latestMeasurement = measurements.find(
      (measurement) => measurement.deviceId === device.id
    );

    return {
      ...device,
      latestMeasurement
    };
  });

  return {
    organization,
    totals: {
      sites: sites.length,
      devices: devices.length,
      onlineDevices: devices.filter((device) => device.status === "online").length,
      activeAlerts: alerts.filter((alert) => alert.status === "active").length
    },
    sites,
    devices: latestByDevice,
    recentAlerts: alerts.slice(0, 5)
  };
}
