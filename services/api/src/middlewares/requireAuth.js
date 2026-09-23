import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { findUserById } from "../modules/platform/platform.repository.js";
import { HttpError } from "../shared/errors/HttpError.js";

export function requireAuth(req, res, next) {
  const cookieName = env.isProduction ? "__Host-environode_session" : "environode_session";
  const cookie = req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  const token = cookie?.slice(cookieName.length + 1);
  if (!token) return next(new HttpError(401, "Autenticacao necessaria."));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = findUserById(payload.sub);

    if (!user || user.organizationId !== payload.organizationId) {
      return next(new HttpError(401, "Sessao invalida."));
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
    next(new HttpError(401, "Sessao invalida ou expirada."));
  }
}
