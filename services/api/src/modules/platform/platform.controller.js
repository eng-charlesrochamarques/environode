import {
  getAlertsByOrganization,
  getDashboardByOrganization,
  getDeviceByOrganization,
  getDevicesByOrganization,
  getMeasurementsByOrganization,
  getSitesByOrganization
} from "./platform.repository.js";
import { HttpError } from "../../shared/errors/HttpError.js";

export function getDashboard(req, res) {
  res.json(getDashboardByOrganization(req.user.organizationId));
}

export function listSites(req, res) {
  res.json({ sites: getSitesByOrganization(req.user.organizationId) });
}

export function listDevices(req, res) {
  res.json({ devices: getDevicesByOrganization(req.user.organizationId) });
}

export function getDevice(req, res, next) {
  const device = getDeviceByOrganization(req.user.organizationId, req.params.deviceId);
  if (!device) return next(new HttpError(404, "Central não encontrada."));
  res.json({ device });
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
