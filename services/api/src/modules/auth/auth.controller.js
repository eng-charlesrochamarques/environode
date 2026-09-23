import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import {
  findOrganizationById,
  findUserByEmail
} from "../platform/platform.repository.js";
import { HttpError } from "../../shared/errors/HttpError.js";

const cookieName = env.isProduction ? "__Host-environode_session" : "environode_session";
const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "strict",
  path: "/"
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== "string" || typeof password !== "string" || email.length > 254 || password.length > 1024 || !email || !password) {
      throw new HttpError(400, "Email e senha sao obrigatorios.");
    }

    const user = findUserByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      throw new HttpError(401, "Email ou senha invalidos.");
    }

    const organization = findOrganizationById(user.organizationId);
    const token = jwt.sign(
      {
        organizationId: user.organizationId,
        role: user.role
      },
      env.jwtSecret,
      {
        subject: user.id,
        expiresIn: env.jwtExpiresIn
      }
    );

    res.cookie(cookieName, token, cookieOptions).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      organization
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  res.clearCookie(cookieName, cookieOptions).status(204).end();
}

export function me(req, res) {
  const organization = findOrganizationById(req.user.organizationId);

  res.json({
    user: req.user,
    organization
  });
}
