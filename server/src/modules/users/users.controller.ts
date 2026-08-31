import type { NextFunction, Request, Response } from "express";
import type { User } from "@prisma/client";
import { updateUserSchema, type UpdateUserInput } from "@shared/schemas/user.schema";
import { ValidationError } from "../../lib/errors";
import { getMyProfile, updateOwnProfile } from "./users.service";

export async function getMyProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getMyProfile(req.userId!);
    res.status(200).json({ user: formatProfileForResponse(user) });
  } catch (error) {
    next(error);
  }
}

export async function updateMyProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const body = parseUpdateProfileRequestBody(req.body);
    const updatedUser = await updateOwnProfile(
      { fullName: body.fullName, avatarFile: req.file },
      req.userId!,
    );
    res.status(200).json({ user: formatProfileForResponse(updatedUser) });
  } catch (error) {
    next(error);
  }
}

function parseUpdateProfileRequestBody(body: unknown): UpdateUserInput {
  const result = updateUserSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten().fieldErrors);
  }
  return result.data;
}

function formatProfileForResponse(user: User) {
  return {
    fullName: user.fullName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}
