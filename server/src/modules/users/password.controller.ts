import type { NextFunction, Request, Response } from "express";
import { changePasswordSchema, type ChangePasswordInput } from "@shared/schemas/user.schema";
import { ValidationError } from "../../lib/errors";
import { findCurrentSessionTokenId } from "../../services/auth.service";
import { changeOwnPassword } from "./password.service";

export async function changeMyPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const body = parseChangePasswordRequestBody(req.body);
    const currentSessionTokenId = await findCurrentSessionTokenId(body.refreshToken);
    await changeOwnPassword(
      { currentPassword: body.currentPassword, newPassword: body.newPassword },
      req.userId!,
      currentSessionTokenId,
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

function parseChangePasswordRequestBody(body: unknown): ChangePasswordInput {
  const result = changePasswordSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}
