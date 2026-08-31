import bcrypt from "bcrypt";
import type { RefreshToken, User } from "@prisma/client";
import type { LoginUserInput, RegisterUserInput } from "@shared/schemas/user.schema";
import type { ResetPasswordInput } from "@shared/schemas/password-reset-token.schema";
import { env } from "../config/env";
import { ConflictError, UnauthorizedError } from "../lib/errors";
import { parseDurationToMs } from "../lib/duration";
import { signAccessToken } from "../lib/jwt";
import { generateRandomToken, hashToken } from "../lib/token";
import {
  createRefreshToken,
  findRefreshTokenByHash,
  revokeAllRefreshTokensExcept,
  revokeRefreshToken,
} from "../db/repositories/refresh-token.repository";
import {
  createPasswordResetToken,
  findPasswordResetTokenByHash,
  markPasswordResetTokenAsUsed,
} from "../db/repositories/password-reset-token.repository";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPassword,
} from "../db/repositories/user.repository";
import { sendPasswordResetEmail } from "./email.service";

const PASSWORD_SALT_ROUNDS = 10;
const INVALID_CREDENTIALS_MESSAGE = "Email o contraseña incorrectos.";
const PASSWORD_RESET_TOKEN_TTL = "1h";
const INVALID_RESET_TOKEN_MESSAGE = "El enlace de recuperación no es válido o expiró.";

export async function registerUser(input: RegisterUserInput) {
  await validateEmailIsUnique(input.email);
  const hashedPassword = await hashPassword(input.password);
  const user = await createUserInDatabase(input, hashedPassword);
  const tokens = await generateAuthTokens(user);
  return { user, ...tokens };
}

async function validateEmailIsUnique(email: string) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError("Ya existe una cuenta registrada con ese email.");
  }
}

export async function hashPassword(password: string) {
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

export async function comparePassword(plainPassword: string, hashedPassword: string) {
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

export async function refreshAccessToken(refreshTokenValue: string) {
  const refreshToken = await validateRefreshToken(refreshTokenValue);
  await revokeUsedRefreshToken(refreshToken.id);
  const user = await getCurrentUser(refreshToken.userId);
  const tokens = await generateAuthTokens(user);
  return { user, ...tokens };
}

async function validateRefreshToken(refreshTokenValue: string): Promise<RefreshToken> {
  const tokenHash = hashToken(refreshTokenValue);
  const refreshToken = await findRefreshTokenByHash(tokenHash);
  const isTokenUsable =
    refreshToken && !refreshToken.revokedAt && refreshToken.expiresAt > new Date();
  if (!isTokenUsable) {
    throw new UnauthorizedError("La sesión expiró. Iniciá sesión nuevamente.");
  }
  return refreshToken;
}

async function revokeUsedRefreshToken(id: string) {
  await revokeRefreshToken(id);
}

// Resolves the RefreshToken row behind the value the client is currently
// holding, so a caller (e.g. HU-43's password change) can identify "this
// session" without the access token needing to carry a session/jti claim.
export async function findCurrentSessionTokenId(refreshTokenValue: string): Promise<string> {
  const tokenHash = hashToken(refreshTokenValue);
  const refreshToken = await findRefreshTokenByHash(tokenHash);
  if (!refreshToken) {
    throw new UnauthorizedError("La sesión actual no es válida.");
  }
  return refreshToken.id;
}

export async function revokeOtherActiveSessions(
  userId: string,
  excludeSessionTokenId: string,
): Promise<void> {
  await revokeAllRefreshTokensExcept(userId, excludeSessionTokenId);
}

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new UnauthorizedError("Sesión inválida.");
  }
  return user;
}

export async function requestPasswordReset(email: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    return;
  }
  const resetToken = await generatePasswordResetToken(user);
  await sendPasswordResetEmailToUser(user.email, resetToken);
}

async function generatePasswordResetToken(user: User) {
  const token = generateRandomToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + parseDurationToMs(PASSWORD_RESET_TOKEN_TTL));
  await createPasswordResetToken({ userId: user.id, tokenHash, expiresAt });
  return token;
}

async function sendPasswordResetEmailToUser(email: string, resetToken: string) {
  const resetUrl = buildPasswordResetUrl(resetToken);
  await sendPasswordResetEmail(email, resetUrl);
}

function buildPasswordResetUrl(resetToken: string) {
  return `${env.APP_URL}/reset-password?token=${resetToken}`;
}

export async function resetPassword(input: ResetPasswordInput) {
  const resetToken = await validatePasswordResetToken(input.token);
  const hashedPassword = await hashPassword(input.password);
  await updateUserPasswordInDatabase(resetToken.userId, hashedPassword);
  await invalidatePasswordResetToken(resetToken.id);
}

async function validatePasswordResetToken(token: string) {
  const tokenHash = hashToken(token);
  const resetToken = await findPasswordResetTokenByHash(tokenHash);
  const isTokenUsable = resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date();
  if (!isTokenUsable) {
    throw new UnauthorizedError(INVALID_RESET_TOKEN_MESSAGE);
  }
  return resetToken;
}

async function updateUserPasswordInDatabase(userId: string, hashedPassword: string) {
  await updateUserPassword(userId, hashedPassword);
}

async function invalidatePasswordResetToken(tokenId: string) {
  await markPasswordResetTokenAsUsed(tokenId);
}
