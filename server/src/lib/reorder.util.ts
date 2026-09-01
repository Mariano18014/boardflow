import type { Prisma } from "@prisma/client";
import { prisma } from "../db/client";

export async function runInTransaction<T>(
  operation: (transaction: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(operation);
}
