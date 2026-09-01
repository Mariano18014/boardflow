import type { Prisma } from "@prisma/client";

export async function shiftTasksBackAfterPosition(
  transaction: Prisma.TransactionClient,
  columnId: string,
  vacatedPosition: number,
) {
  await transaction.task.updateMany({
    where: { columnId, position: { gt: vacatedPosition } },
    data: { position: { decrement: 1 } },
  });
}

export async function shiftTasksForwardFromPosition(
  transaction: Prisma.TransactionClient,
  columnId: string,
  insertPosition: number,
) {
  await transaction.task.updateMany({
    where: { columnId, position: { gte: insertPosition } },
    data: { position: { increment: 1 } },
  });
}

export async function shiftTasksForReorderWithinColumn(
  transaction: Prisma.TransactionClient,
  columnId: string,
  oldPosition: number,
  newPosition: number,
) {
  if (newPosition === oldPosition) {
    return;
  }
  if (newPosition > oldPosition) {
    await transaction.task.updateMany({
      where: { columnId, position: { gt: oldPosition, lte: newPosition } },
      data: { position: { decrement: 1 } },
    });
    return;
  }
  await transaction.task.updateMany({
    where: { columnId, position: { gte: newPosition, lt: oldPosition } },
    data: { position: { increment: 1 } },
  });
}
