import bcrypt from "bcrypt";
import type { RegisterUserInput } from "@shared/schemas/user.schema";
import { ConflictError } from "../lib/errors";
import { createUser, findUserByEmail } from "../db/repositories/user.repository";

const PASSWORD_SALT_ROUNDS = 10;

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
