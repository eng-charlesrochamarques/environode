import { ingestTelemetry } from "../services/telemetry.service.js";

export async function receiveTelemetry(req, res, next) {
  try {
    const result = await ingestTelemetry(req.device, req.body);
    return res.status(result.accepted ? 202 : 200).json(result);
  } catch (error) { return next(error); }
}
