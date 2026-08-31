import { prisma } from "../../db/client";
import { runInTransaction } from "../../lib/reorder.util";

type CreateBoardData = {
  projectId: string;
  name: string;
  position: number;
};

export async function createBoard(data: CreateBoardData) {
  return prisma.board.create({ data });
}

export async function findMaxBoardPositionByProjectId(projectId: string): Promise<number | null> {
  const result = await prisma.board.aggregate({
    where: { projectId },
    _max: { position: true },
  });
  return result._max.position;
}

export async function findActiveBoardsByProjectId(projectId: string) {
  return prisma.board.findMany({
    where: { projectId, isArchived: false },
    orderBy: { position: "asc" },
  });
}

export async function updateBoardPositions(boardIds: string[]) {
  return runInTransaction((transaction) =>
    Promise.all(
      boardIds.map((boardId, index) =>
        transaction.board.update({ where: { id: boardId }, data: { position: index } }),
      ),
    ),
  );
}
