import { prisma } from "../client";

type CreateRefreshTokenData = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export async function createRefreshToken(data: CreateRefreshTokenData) {
  return prisma.refreshToken.create({ data });
}

export async function findRefreshTokenByHash(tokenHash: string) {
  return prisma.refreshToken.findFirst({ where: { tokenHash } });
}

export async function revokeRefreshToken(id: string) {
  return prisma.refreshToken.update({
    where: { id },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllRefreshTokensExcept(userId: string, excludeId: string) {
  return prisma.refreshToken.updateMany({
    where: { userId, id: { not: excludeId }, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
