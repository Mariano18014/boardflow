import { prisma } from "../../db/client";

type UpdateProfileData = {
  fullName?: string;
  avatarUrl?: string;
};

export async function updateUserProfile(userId: string, data: UpdateProfileData) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}
