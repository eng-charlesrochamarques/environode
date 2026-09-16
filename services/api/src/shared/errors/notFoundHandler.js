import { HttpError } from "./HttpError.js";

export function notFoundHandler(req, res, next) {
  next(new HttpError(404, "Route not found."));
}
