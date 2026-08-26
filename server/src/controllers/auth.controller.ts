import type { NextFunction, Request, Response } from "express";
import type { User } from "@prisma/client";
import {
  loginUserSchema,
  registerUserSchema,
  type LoginUserInput,
  type RegisterUserInput,
} from "@shared/schemas/user.schema";
import { ValidationError } from "../lib/errors";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service";

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseRegisterRequestBody(req.body);
    const user = await registerUser(input);
    res.status(201).json({ user: formatUserForResponse(user) });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseLoginRequestBody(req.body);
    const { user, accessToken, refreshToken } = await loginUser(input);
    res.status(200).json({
      user: formatUserForResponse(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function meController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getCurrentUser(req.userId!);
    res.status(200).json({ user: formatUserForResponse(user) });
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

function parseLoginRequestBody(body: unknown): LoginUserInput {
  const result = loginUserSchema.safeParse(body);
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
