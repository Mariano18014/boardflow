import type { NextFunction, Request, Response } from "express";

export function errorHandlerMiddleware(err: any, _req: Request, res: Response, next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Internal Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  const responseBody: Record<string, unknown> = { message };
  if (err.fieldErrors) {
    responseBody.fieldErrors = err.fieldErrors;
  }

  return res.status(status).json(responseBody);
}
