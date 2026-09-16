import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { findUserById } from "../modules/platform/platform.repository.js";
import { HttpError } from "../shared/errors/HttpError.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authentication token is required."));
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, env.jwtSecret);
    const user = findUserById(payload.sub);

    if (!user || user.organizationId !== payload.organizationId) {
      return next(new HttpError(401, "Invalid authentication token."));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };

    next();
  } catch (error) {
    next(new HttpError(401, "Invalid or expired authentication token."));
  }
}
