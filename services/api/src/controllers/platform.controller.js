import { HttpError } from "../shared/errors/HttpError.js";
import * as platform from "../services/platform.service.js";

export async function getDashboard(req, res, next) {
  try { return res.json(await platform.dashboard(req.user.organizationId)); } catch (error) { return next(error); }
}
export async function listSites(req, res, next) {
  try { return res.json({ sites: await platform.listSites(req.user.organizationId) }); } catch (error) { return next(error); }
}
export async function listDevices(req, res, next) {
  try { return res.json({ devices: await platform.listDevices(req.user.organizationId) }); } catch (error) { return next(error); }
}
export async function getDevice(req, res, next) {
  try {
    const device = await platform.findDevice(req.user.organizationId, req.params.deviceId);
    if (!device) throw new HttpError(404, "Central não encontrada.");
    return res.json({ device });
  } catch (error) { return next(error); }
}
export async function listMeasurements(req, res, next) {
  try {
    if (req.query.deviceId && !await platform.findDevice(req.user.organizationId, req.query.deviceId)) throw new HttpError(404, "Central não encontrada.");
    return res.json({ measurements: await platform.listMeasurements(req.user.organizationId, req.query) });
  } catch (error) { return next(error); }
}
export async function listDeviceMeasurements(req, res, next) {
  try {
    if (!await platform.findDevice(req.user.organizationId, req.params.deviceId)) throw new HttpError(404, "Central não encontrada.");
    return res.json({ measurements: await platform.listMeasurements(req.user.organizationId, { ...req.query, deviceId: req.params.deviceId }) });
  } catch (error) { return next(error); }
}
export async function listAlerts(req, res, next) {
  try { return res.json({ alerts: await platform.listAlerts(req.user.organizationId) }); } catch (error) { return next(error); }
}
