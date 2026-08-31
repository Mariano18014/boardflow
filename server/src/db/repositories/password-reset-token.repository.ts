import { prisma } from "../client";

type CreatePasswordResetTokenData = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export async function createPasswordResetToken(data: CreatePasswordResetTokenData) {
  return prisma.passwordResetToken.create({ data });
}

export async function findPasswordResetTokenByHash(tokenHash: string) {
  return prisma.passwordResetToken.findUnique({ where: { tokenHash } });
}

export async function markPasswordResetTokenAsUsed(id: string) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}
