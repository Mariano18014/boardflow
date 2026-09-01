import type { User } from "@prisma/client";
import { UnauthorizedError, ValidationError } from "../../lib/errors";
import { updateUserPassword } from "../../db/repositories/user.repository";
import { comparePassword, hashPassword, revokeOtherActiveSessions } from "../../services/auth.service";
import { findUserById } from "./users.service";

const CURRENT_PASSWORD_INCORRECT_MESSAGE = "La contraseña actual no es correcta.";

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export async function changeOwnPassword(
  input: ChangePasswordInput,
  userId: string,
  currentSessionTokenId: string,
): Promise<void> {
  const user = await findUserById(userId);
  await checkCurrentPasswordMatches(input.currentPassword, user.passwordHash);
  await checkNewPasswordIsDifferent(input.newPassword, input.currentPassword);
  const newPasswordHash = await hashPassword(input.newPassword);
  await savePasswordChange(user, newPasswordHash);
  await revokeOtherActiveSessions(userId, currentSessionTokenId);
}

async function checkCurrentPasswordMatches(plainPassword: string, storedHash: string): Promise<void> {
  const matches = await comparePassword(plainPassword, storedHash);
  if (!matches) {
    throw new UnauthorizedError(CURRENT_PASSWORD_INCORRECT_MESSAGE);
  }
}

async function checkNewPasswordIsDifferent(newPassword: string, currentPassword: string): Promise<void> {
  if (newPassword === currentPassword) {
    throw new ValidationError({
      newPassword: ["La nueva contraseña debe ser diferente de la actual."],
    });
  }
}

async function savePasswordChange(user: User, newPasswordHash: string): Promise<void> {
  await updateUserPassword(user.id, newPasswordHash);
}
