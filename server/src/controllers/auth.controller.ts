import type { NextFunction, Request, Response } from "express";
import type { User } from "@prisma/client";
import { registerUserSchema, type RegisterUserInput } from "@shared/schemas/user.schema";
import { ValidationError } from "../lib/errors";
import { registerUser } from "../services/auth.service";

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseRegisterRequestBody(req.body);
    const user = await registerUser(input);
    res.status(201).json({ user: formatUserForResponse(user) });
  } catch (error) {
    next(error);
  }
}

function parseRegisterRequestBody(body: unknown): RegisterUserInput {
  const result = registerUserSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatUserForResponse(user: User) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    status: user.status,
  };
}
