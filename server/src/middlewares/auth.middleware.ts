import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../lib/errors";
import { verifyAccessToken } from "../lib/jwt";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req);
    const payload = verifyAccessToken(token);
    attachUserIdToRequest(req, payload.sub);
    next();
  } catch {
    next(new UnauthorizedError("No autorizado."));
  }
}

function extractBearerToken(req: Request): string {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }
  return authorizationHeader.slice("Bearer ".length);
}

function attachUserIdToRequest(req: Request, userId: string) {
  req.userId = userId;
}
