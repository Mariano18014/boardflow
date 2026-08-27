import type { Project } from "@prisma/client";
import type { CreateBoardInput } from "@shared/schemas/board.schema";
import { ConflictError, NotFoundError } from "../../lib/errors";
import { findProjectByIdAndOrganizationId } from "../../db/repositories/project.repository";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { createBoard as saveBoardRecord, findMaxBoardPositionByProjectId } from "./boards.repository";

const FIRST_BOARD_POSITION = 0;

export async function createBoard(input: CreateBoardInput, requesterId: string) {
  await checkRequesterHasPermission(input.organizationId, requesterId, "boards:create");
  const project = await findProjectById(input.projectId, input.organizationId);
  await checkProjectIsNotArchived(project);
  const nextPosition = await calculateNextBoardPosition(input.projectId);
  const board = await saveBoardInDatabase(input, nextPosition);
  return board;
}

async function findProjectById(projectId: string, organizationId: string): Promise<Project> {
  const project = await findProjectByIdAndOrganizationId(projectId, organizationId);
  if (!project) {
    throw new NotFoundError("El proyecto no existe en esta organización.");
  }
  return project;
}

async function checkProjectIsNotArchived(project: Project) {
  if (project.isArchived) {
    throw new ConflictError("No se pueden crear tableros en un proyecto archivado.");
  }
}

async function calculateNextBoardPosition(projectId: string): Promise<number> {
  const maxPosition = await findMaxBoardPositionByProjectId(projectId);
  if (maxPosition === null) {
    return FIRST_BOARD_POSITION;
  }
  return maxPosition + 1;
}

async function saveBoardInDatabase(input: CreateBoardInput, position: number) {
  return saveBoardRecord({
    projectId: input.projectId,
    name: input.name,
    position,
  });
}
