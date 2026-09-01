import type { User } from "@prisma/client";
import { NotFoundError } from "../../lib/errors";
import { findUserById as findUserRecordById } from "../../db/repositories/user.repository";
import { deleteFile, saveFile, validateImageFile } from "../../services/file-storage.service";
import { updateUserProfile as saveUserProfileRecord } from "./users.repository";

const AVATARS_SUBFOLDER = "user-avatars";

export async function getMyProfile(userId: string): Promise<User> {
  return findUserById(userId);
}

export type UpdateProfileInput = {
  fullName?: string;
  avatarFile?: Express.Multer.File;
};

export async function updateOwnProfile(input: UpdateProfileInput, userId: string): Promise<User> {
  const user = await findUserById(userId);
  let avatarUrl: string | undefined;
  if (input.avatarFile) {
    await validateAvatarFile(input.avatarFile);
    avatarUrl = await saveAvatarFileToDisk(input.avatarFile);
    await deleteOldAvatarFile(user.avatarUrl);
  }
  const updatedUser = await saveProfileChanges(user, { fullName: input.fullName, avatarUrl });
  return updatedUser;
}

export async function findUserById(userId: string): Promise<User> {
  const user = await findUserRecordById(userId);
  if (!user) {
    throw new NotFoundError("El usuario no existe.");
  }
  return user;
}

async function validateAvatarFile(file: Express.Multer.File): Promise<void> {
  validateImageFile(file, "avatar");
}

async function saveAvatarFileToDisk(file: Express.Multer.File): Promise<string> {
  return saveFile(AVATARS_SUBFOLDER, {
    originalName: file.originalname,
    buffer: file.buffer,
  });
}

async function deleteOldAvatarFile(currentAvatarUrl: string | null): Promise<void> {
  if (!currentAvatarUrl) {
    return;
  }
  await deleteFile(currentAvatarUrl);
}

type ProfileChanges = {
  fullName?: string;
  avatarUrl?: string;
};

async function saveProfileChanges(user: User, changes: ProfileChanges): Promise<User> {
  return saveUserProfileRecord(user.id, changes);
}
