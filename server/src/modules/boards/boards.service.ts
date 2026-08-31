import type { Board } from "@prisma/client";
import type { CreateBoardInput } from "@shared/schemas/board.schema";
import { ConflictError, ValidationError } from "../../lib/errors";
import { checkProjectIsNotArchived, findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { calculateNextPosition } from "../../lib/next-position.util";
import {
  createBoard as saveBoardRecord,
  findActiveBoardsByProjectId,
  findMaxBoardPositionByProjectId,
  updateBoardPositions,
} from "./boards.repository";

export async function createBoard(input: CreateBoardInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "boards:create");
  const project = await findProjectById(input.projectId, input.organizationId);
  await checkProjectIsNotArchived(project);
  const nextPosition = await calculateNextBoardPosition(input.projectId);
  const board = await saveBoardInDatabase(input, nextPosition);
  return board;
}

async function calculateNextBoardPosition(projectId: string): Promise<number> {
  return calculateNextPosition(() => findMaxBoardPositionByProjectId(projectId));
}

async function saveBoardInDatabase(input: CreateBoardInput, position: number) {
  return saveBoardRecord({
    projectId: input.projectId,
    name: input.name,
    position,
  });
}

export type GetBoardsInput = {
  organizationId: string;
  projectId: string;
};

export async function getBoardsForProject(input: GetBoardsInput, requesterId: string): Promise<Board[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "boards:view");
  await findProjectById(input.projectId, input.organizationId);
  return findActiveBoardsByProject(input.projectId);
}

export type ReorderBoardsInput = {
  organizationId: string;
  projectId: string;
  boardIds: string[];
};

export async function reorderBoards(input: ReorderBoardsInput, requesterId: string): Promise<Board[]> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "boards:edit");
  await findProjectById(input.projectId, input.organizationId);
  const activeBoards = await findActiveBoardsByProject(input.projectId);
  checkAllBoardIdsBelongToProject(input.boardIds, activeBoards);
  checkBoardIdsCountMatchesActiveBoards(input.boardIds, activeBoards);
  const reorderedBoards = await updateBoardPositionsInTransaction(input.boardIds);
  return reorderedBoards;
}

async function findActiveBoardsByProject(projectId: string): Promise<Board[]> {
  return findActiveBoardsByProjectId(projectId);
}

function checkAllBoardIdsBelongToProject(boardIds: string[], activeBoards: Board[]) {
  const activeBoardIds = new Set(activeBoards.map((board) => board.id));
  const unknownBoardIds = boardIds.filter((boardId) => !activeBoardIds.has(boardId));
  if (unknownBoardIds.length > 0) {
    throw new ValidationError({
      boardIds: [`Los siguientes tableros no pertenecen a este proyecto: ${unknownBoardIds.join(", ")}`],
    });
  }
}

function checkBoardIdsCountMatchesActiveBoards(boardIds: string[], activeBoards: Board[]) {
  // Compares unique ids, not raw length, so a duplicated id in the payload
  // can't slip through by coincidentally matching the active board count.
  const uniqueBoardIdsCount = new Set(boardIds).size;
  if (uniqueBoardIdsCount !== activeBoards.length) {
    throw new ConflictError(
      "El orden recibido no coincide con los tableros activos del proyecto. Actualizá la página e intentá de nuevo.",
    );
  }
}

async function updateBoardPositionsInTransaction(boardIds: string[]): Promise<Board[]> {
  return updateBoardPositions(boardIds);
}
