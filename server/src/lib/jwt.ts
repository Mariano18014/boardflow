import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { parseDurationToMs } from "./duration";

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  const expiresInSeconds = parseDurationToMs(env.JWT_EXPIRES_IN) / 1000;
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}
