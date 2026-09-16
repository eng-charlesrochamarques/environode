import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import {
  findOrganizationById,
  findUserByEmail
} from "../platform/platform.repository.js";
import { HttpError } from "../../shared/errors/HttpError.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new HttpError(400, "Email and password are required.");
    }

    const user = findUserByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      throw new HttpError(401, "Invalid email or password.");
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

    res.json({
      token,
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

export function me(req, res) {
  const organization = findOrganizationById(req.user.organizationId);

  res.json({
    user: req.user,
    organization
  });
}
