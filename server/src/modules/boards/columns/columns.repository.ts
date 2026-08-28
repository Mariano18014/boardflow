import { prisma } from "../../../db/client";

export async function findColumnsByBoardId(boardId: string) {
  return prisma.column.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
  });
}

type CreateColumnData = {
  boardId: string;
  name: string;
  position: number;
};

export async function createColumn(data: CreateColumnData) {
  return prisma.column.create({ data });
}
