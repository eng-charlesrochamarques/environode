import { env } from "../config/env.js";
import { HttpError } from "../shared/errors/HttpError.js";

export function requireBrowserOrigin(req, res, next) {
  if (req.get("Origin") !== env.corsOrigin) return next(new HttpError(403, "Origem não autorizada."));
  return next();
}
