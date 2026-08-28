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

type CreateColumnData = {
  boardId: string;
  name: string;
  position: number;
};

export async function createColumn(data: CreateColumnData) {
  return prisma.column.create({ data });
}
