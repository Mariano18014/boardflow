import { prisma } from "../../../db/client";
import { runInTransaction } from "../../../lib/reorder.util";

export async function findAssigneeRecordsByTaskId(taskId: string) {
  return prisma.taskAssignee.findMany({
    where: { taskId },
    include: { user: true },
  });
}

export async function replaceAssigneeRecordsForTask(taskId: string, userIds: string[]) {
  return runInTransaction(async (transaction) => {
    await transaction.taskAssignee.deleteMany({ where: { taskId } });
    if (userIds.length > 0) {
      await transaction.taskAssignee.createMany({
        data: userIds.map((userId) => ({ taskId, userId })),
      });
    }
    return transaction.taskAssignee.findMany({ where: { taskId }, include: { user: true } });
  });
}
