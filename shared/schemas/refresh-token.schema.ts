import { z } from "zod";

export const refreshTokenSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tokenHash: z.string(),
  expiresAt: z.date(),
  revokedAt: z.date().nullable(),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
