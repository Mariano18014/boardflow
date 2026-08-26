import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import type { LoginUserInput, RegisterUserInput } from "@shared/schemas/user.schema";
import { env } from "../config/env";
import { ConflictError, UnauthorizedError } from "../lib/errors";
import { parseDurationToMs } from "../lib/duration";
import { signAccessToken } from "../lib/jwt";
import { generateRandomToken, hashToken } from "../lib/token";
import { createRefreshToken } from "../db/repositories/refresh-token.repository";
import { createUser, findUserByEmail, findUserById } from "../db/repositories/user.repository";

const PASSWORD_SALT_ROUNDS = 10;
const INVALID_CREDENTIALS_MESSAGE = "Email o contraseña incorrectos.";

export async function registerUser(input: RegisterUserInput) {
  await validateEmailIsUnique(input.email);
  const hashedPassword = await hashPassword(input.password);
  const user = await createUserInDatabase(input, hashedPassword);
  return user;
}

async function validateEmailIsUnique(email: string) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError("Ya existe una cuenta registrada con ese email.");
  }
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
}

async function createUserInDatabase(input: RegisterUserInput, hashedPassword: string) {
  return createUser({
    email: input.email,
    passwordHash: hashedPassword,
    fullName: input.fullName,
  });
}

export async function loginUser(credentials: LoginUserInput) {
  const user = await findUserForLogin(credentials.email);
  await validateCredentials(credentials.password, user);
  const tokens = await generateAuthTokens(user);
  return { user, ...tokens };
}

async function findUserForLogin(email: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
  }
  return user;
}

async function validateCredentials(plainPassword: string, user: User) {
  const isPasswordValid = await comparePassword(plainPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
  }
}

async function comparePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

async function generateAuthTokens(user: User) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = await generateRefreshToken(user.id);
  return { accessToken, refreshToken };
}

async function generateRefreshToken(userId: string) {
  const token = generateRandomToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN));
  await createRefreshToken({ userId, tokenHash, expiresAt });
  return token;
}

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new UnauthorizedError("Sesión inválida.");
  }
  return user;
}
