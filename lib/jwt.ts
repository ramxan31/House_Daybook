import jwt, { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "fallback-secret-key";

const JWT_EXPIRES_IN: number | StringValue =
  (process.env.JWT_EXPIRES_IN as StringValue) ?? "7d";

export interface JWTPayload {
  userId: string;
  email: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}
