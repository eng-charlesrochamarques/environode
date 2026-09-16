import {
  getAlertsByOrganization,
  getDashboardByOrganization,
  getDevicesByOrganization,
  getMeasurementsByOrganization,
  getSitesByOrganization
} from "./platform.repository.js";

export function getDashboard(req, res) {
  res.json(getDashboardByOrganization(req.user.organizationId));
}

export function listSites(req, res) {
  res.json({ sites: getSitesByOrganization(req.user.organizationId) });
}

export function listDevices(req, res) {
  res.json({ devices: getDevicesByOrganization(req.user.organizationId) });
}

export function listMeasurements(req, res) {
  const { deviceId } = req.query;

  res.json({
    measurements: getMeasurementsByOrganization(req.user.organizationId, deviceId)
  });
}

export function listAlerts(req, res) {
  res.json({ alerts: getAlertsByOrganization(req.user.organizationId) });
}
