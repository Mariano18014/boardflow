import { prisma } from "../../../db/client";

export async function findColumnsByBoardId(boardId: string) {
  return prisma.column.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
  });
}

export async function findColumnById(columnId: string) {
  return prisma.column.findUnique({ where: { id: columnId } });
}

export async function findColumnByBoardIdAndName(boardId: string, name: string) {
  return prisma.column.findFirst({ where: { boardId, name } });
}

export async function findColumnByIdAndProjectId(columnId: string, projectId: string) {
  return prisma.column.findFirst({ where: { id: columnId, board: { projectId } } });
}

type CreateColumnData = {
  boardId: string;
  name: string;
  position: number;
};

export async function createColumn(data: CreateColumnData) {
  return prisma.column.create({ data });
}

export async function updateColumnWipLimit(columnId: string, wipLimit: number | null) {
  return prisma.column.update({ where: { id: columnId }, data: { wipLimit } });
}

export async function countTasksInColumn(columnId: string): Promise<number> {
  return prisma.task.count({
    where: { columnId, isArchived: false, deletedAt: null },
  });
}
