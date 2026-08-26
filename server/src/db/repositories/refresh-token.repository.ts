import { prisma } from "../client";

type CreateRefreshTokenData = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export async function createRefreshToken(data: CreateRefreshTokenData) {
  return prisma.refreshToken.create({ data });
}
