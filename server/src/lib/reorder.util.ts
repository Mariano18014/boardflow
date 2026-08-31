import type { Prisma } from "@prisma/client";
import { prisma } from "../db/client";

// Thin wrapper around Prisma's interactive transaction so any module that needs
// to update several records' positions atomically (boards now, columns/tasks
// later) can share the same "all or nothing" guarantee without duplicating the
// $transaction call.
export async function runInTransaction<T>(
  operation: (transaction: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(operation);
}
