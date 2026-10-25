import { HttpError } from "./HttpError.js";

export function notFoundHandler(req, res, next) {
  next(new HttpError(404, "Rota não encontrada."));
}
