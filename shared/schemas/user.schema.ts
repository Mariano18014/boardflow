import { z } from "zod";
import { USER_STATUS } from "../types/enums";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string(),
  fullName: z.string().min(1),
  avatarUrl: z.string().url().nullable(),
  status: z.enum(USER_STATUS),
  lastLoginAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateUserSchema = userSchema
  .pick({ fullName: true, avatarUrl: true })
  .partial();

export type User = z.infer<typeof userSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
