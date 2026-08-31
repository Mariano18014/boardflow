import { prisma } from "../../../db/client";
import { runInTransaction } from "../../../lib/reorder.util";

export async function findLabelRecordsByTaskId(taskId: string) {
  return prisma.taskLabel.findMany({
    where: { taskId },
    include: { label: true },
  });
}

export async function replaceLabelRecordsForTask(taskId: string, labelIds: string[]) {
  return runInTransaction(async (transaction) => {
    await transaction.taskLabel.deleteMany({ where: { taskId } });
    if (labelIds.length > 0) {
      await transaction.taskLabel.createMany({
        data: labelIds.map((labelId) => ({ taskId, labelId })),
      });
    }
    return transaction.taskLabel.findMany({ where: { taskId }, include: { label: true } });
  });
}
