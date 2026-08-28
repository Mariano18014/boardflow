import type { Prisma } from "@prisma/client";

// Shifts every task after the position a task just vacated one slot back,
// closing the gap so the column's positions stay a contiguous 0..n-1 sequence.
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

// Shifts every task at or after the insertion point one slot forward, opening
// a slot for the task being inserted there.
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

// Recalculates positions for the tasks strictly between a task's old and new
// position when it reorders within the same column.
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
