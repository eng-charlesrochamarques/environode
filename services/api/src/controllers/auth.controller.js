import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { cookieName } from "../middlewares/requireAuth.js";
import { User } from "../models/User.js";
import { HttpError } from "../shared/errors/HttpError.js";
import { findOrganization } from "../services/platform.service.js";

const cookieOptions = { httpOnly: true, secure: env.isProduction, sameSite: "strict", path: "/" };

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email || !password || email.length > 254 || password.length > 1024) throw new HttpError(400, "Email e senha são obrigatórios.");
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash").lean();
    if (!user || !await bcrypt.compare(password, user.passwordHash)) throw new HttpError(401, "Email ou senha inválidos.");
    const organization = await findOrganization(user.organizationId);
    const token = jwt.sign({ organizationId: user.organizationId, role: user.role }, env.jwtSecret, { subject: String(user._id), expiresIn: env.jwtExpiresIn });
    return res.cookie(cookieName, token, cookieOptions).json({ user: { id: String(user._id), name: user.name, email: user.email, role: user.role }, organization });
  } catch (error) { return next(error); }
}

export function logout(req, res) { res.clearCookie(cookieName, cookieOptions).status(204).end(); }

export async function me(req, res, next) {
  try { return res.json({ user: req.user, organization: await findOrganization(req.user.organizationId) }); }
  catch (error) { return next(error); }
}
