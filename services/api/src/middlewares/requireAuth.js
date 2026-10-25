import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { HttpError } from "../shared/errors/HttpError.js";

const cookieName = env.isProduction ? "__Host-environode_session" : "environode_session";

export async function requireAuth(req, res, next) {
  const cookie = req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  const token = cookie?.slice(cookieName.length + 1);
  if (!token) return next(new HttpError(401, "Autenticação necessária."));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).lean();

    if (!user || user.organizationId !== payload.organizationId) {
      return next(new HttpError(401, "Sessão inválida."));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };

    return next();
  } catch (error) {
    if (error instanceof HttpError) return next(error);
    return next(new HttpError(401, "Sessão inválida ou expirada."));
  }
}

export { cookieName };
