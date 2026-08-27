import { prisma } from "../../db/client";

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
