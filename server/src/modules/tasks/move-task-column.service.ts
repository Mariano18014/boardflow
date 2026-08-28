import type { Prisma, Task } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../lib/errors";
import { findProjectById } from "../../services/project.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { runInTransaction } from "../../lib/reorder.util";
import {
  shiftTasksBackAfterPosition,
  shiftTasksForReorderWithinColumn,
  shiftTasksForwardFromPosition,
} from "../../lib/column-position.util";
import { findColumnById } from "../boards/columns/columns.repository";
import { countTasksInColumn, findTaskByIdAndProjectId } from "./tasks.repository";

export type MoveTaskToColumnInput = {
  organizationId: string;
  projectId: string;
  taskId: string;
  columnId: string;
  position: number;
};

export async function moveTaskToColumn(input: MoveTaskToColumnInput, requesterId: string): Promise<Task> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "tasks:edit");
  // findTaskById only confirms the task belongs to projectId — it says nothing
  // about projectId belonging to organizationId, so this extra check (same as
  // every other module in this codebase, see sprint-board.service.ts) is what
  // actually prevents cross-organization access.
  await findProjectById(input.projectId, input.organizationId);
  const task = await findTaskById(input.taskId, input.projectId);
  checkTaskBelongsToActiveSprint(task);
  await checkColumnBelongsToSameBoard(input.columnId, task.boardId);
  const isSameColumn = task.columnId === input.columnId;
  if (isSameColumn) {
    await reorderWithinColumn(task, input.position);
  } else {
    await moveBetweenColumns(task, input.columnId, input.position);
  }
  return findTaskById(input.taskId, input.projectId);
}

async function findTaskById(taskId: string, projectId: string): Promise<Task> {
  const task = await findTaskByIdAndProjectId(taskId, projectId);
  if (!task) {
    throw new NotFoundError("La tarea no existe en este proyecto.");
  }
  return task;
}

function checkTaskBelongsToActiveSprint(task: Task) {
  if (task.sprintId === null) {
    throw new ConflictError("Una tarea del backlog no tiene tablero. Asignala a un sprint primero.");
  }
}

async function checkColumnBelongsToSameBoard(columnId: string, boardId: string | null) {
  const column = await findColumnById(columnId);
  if (!column) {
    throw new NotFoundError("La columna de destino no existe.");
  }
  if (column.boardId !== boardId) {
    throw new ConflictError("La columna de destino no pertenece al tablero de esta tarea.");
  }
}

async function reorderWithinColumn(task: Task, requestedPosition: number) {
  const columnId = getCurrentColumnId(task);
  const newPosition = await clampPositionForReorder(columnId, requestedPosition);
  await runInTransaction(async (transaction) => {
    await shiftTasksForReorderWithinColumn(transaction, columnId, task.position, newPosition);
    await transaction.task.update({ where: { id: task.id }, data: { position: newPosition } });
  });
}

async function moveBetweenColumns(task: Task, newColumnId: string, requestedPosition: number) {
  const previousColumnId = getCurrentColumnId(task);
  const newPosition = await clampPositionForInsertion(newColumnId, requestedPosition);
  await runInTransaction(async (transaction) => {
    await shiftSourceColumnPositions(transaction, previousColumnId, task.position);
    await shiftDestinationColumnPositions(transaction, newColumnId, newPosition);
    await transaction.task.update({
      where: { id: task.id },
      data: { columnId: newColumnId, position: newPosition },
    });
  });
}

async function shiftSourceColumnPositions(
  transaction: Prisma.TransactionClient,
  columnId: string,
  vacatedPosition: number,
) {
  await shiftTasksBackAfterPosition(transaction, columnId, vacatedPosition);
}

async function shiftDestinationColumnPositions(
  transaction: Prisma.TransactionClient,
  columnId: string,
  insertPosition: number,
) {
  await shiftTasksForwardFromPosition(transaction, columnId, insertPosition);
}

// HU-28 always writes boardId and columnId together (see
// updateTaskColumnAssignment in tasks.repository.ts), and
// checkColumnBelongsToSameBoard already confirmed task.boardId matches a real
// column, so task.columnId can't be null by the time this runs.
function getCurrentColumnId(task: Task): string {
  return task.columnId as string;
}

async function clampPositionForReorder(columnId: string, requestedPosition: number): Promise<number> {
  const taskCount = await countTasksInColumn(columnId);
  const maxValidPosition = taskCount - 1;
  return clampPosition(requestedPosition, maxValidPosition);
}

async function clampPositionForInsertion(columnId: string, requestedPosition: number): Promise<number> {
  const taskCount = await countTasksInColumn(columnId);
  const maxValidPosition = taskCount;
  return clampPosition(requestedPosition, maxValidPosition);
}

function clampPosition(requestedPosition: number, maxValidPosition: number): number {
  if (requestedPosition < 0) {
    return 0;
  }
  if (requestedPosition > maxValidPosition) {
    return maxValidPosition;
  }
  return requestedPosition;
}
