import { z } from "zod";

export const refreshTokenSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tokenHash: z.string(),
  expiresAt: z.date(),
  revokedAt: z.date().nullable(),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;

export const refreshAccessTokenSchema = z.object({
  refreshToken: z.string().min(1, "El refresh token es requerido."),
});

export type RefreshAccessTokenInput = z.infer<typeof refreshAccessTokenSchema>;
