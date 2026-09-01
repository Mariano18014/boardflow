import type { Column } from "@prisma/client";
import { ConflictError, NotFoundError, ValidationError } from "../../../lib/errors";
import { findProjectById } from "../../../services/project.service";
import { checkRequesterHasPermission } from "../../permissions/check-permission";
import { notifySprintBoardChangedForProject } from "../../realtime/notify.service";
import {
  countTasksInColumn,
  createColumn,
  findColumnById,
  findColumnByIdAndProjectId,
  findColumnsByBoardId,
  updateColumnWipLimit as saveColumnWipLimit,
} from "./columns.repository";

// The fixed set of status columns every board gets seeded with the first time
// its board is opened (HU-28). Not user-configurable in this HU.
const DEFAULT_COLUMN_NAMES = ["To Do", "In Progress", "Review", "Done"];

// Idempotent: only seeds the default columns the first time a board has none.
export async function ensureDefaultColumnsExist(boardId: string) {
  const boardHasColumns = await checkBoardHasColumns(boardId);
  if (boardHasColumns) {
    return;
  }
  await createDefaultColumns(boardId);
}

async function checkBoardHasColumns(boardId: string): Promise<boolean> {
  const existingColumns = await findColumnsByBoardId(boardId);
  return existingColumns.length > 0;
}

async function createDefaultColumns(boardId: string) {
  for (let position = 0; position < DEFAULT_COLUMN_NAMES.length; position++) {
    await createColumn({ boardId, name: DEFAULT_COLUMN_NAMES[position], position });
  }
}

export type UpdateColumnWipLimitInput = {
  organizationId: string;
  projectId: string;
  columnId: string;
  wipLimit: number | null;
};

export async function updateColumnWipLimit(
  input: UpdateColumnWipLimitInput,
  requesterId: string,
): Promise<Column> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "boards:edit");
  // findColumnByIdAndProjectId only confirms the column belongs to projectId —
  // it says nothing about projectId belonging to organizationId, so this
  // extra check (same as every other module in this codebase, see
  // move-task-column.service.ts) is what actually prevents cross-organization
  // access.
  await findProjectById(input.projectId, input.organizationId);
  const column = await findColumnScopedToProject(input.columnId, input.projectId);
  validateWipLimitValue(input.wipLimit);
  const updatedColumn = await saveColumnWipLimitOnColumn(column, input.wipLimit);
  await notifySprintBoardChangedForProject(input.projectId);
  return updatedColumn;
}

async function findColumnScopedToProject(columnId: string, projectId: string): Promise<Column> {
  const column = await findColumnByIdAndProjectId(columnId, projectId);
  if (!column) {
    throw new NotFoundError("La columna no existe en este proyecto.");
  }
  return column;
}

// Deliberately does NOT compare the new limit against the column's current
// task count: a project can define wipLimit: 3 on a column that already has 6
// tasks, and saving is still allowed. The limit only blocks FUTURE moves into
// the column (see checkDestinationColumnHasCapacity below) — it never forces
// an immediate correction of the existing state.
function validateWipLimitValue(wipLimit: number | null) {
  if (wipLimit === null) {
    return;
  }
  if (!Number.isInteger(wipLimit) || wipLimit < 1) {
    throw new ValidationError({
      wipLimit: ["El límite WIP debe ser un número entero mayor o igual a 1."],
    });
  }
}

async function saveColumnWipLimitOnColumn(column: Column, wipLimit: number | null): Promise<Column> {
  return saveColumnWipLimit(column.id, wipLimit);
}

// Used by moveTaskToColumn (tasks module, HU-29) before moving a task INTO
// this column — reordering within the same column never calls this.
export async function checkDestinationColumnHasCapacity(columnId: string) {
  const column = await findColumnById(columnId);
  if (!column || column.wipLimit === null) {
    return;
  }
  const currentTaskCount = await countTasksInColumn(columnId);
  checkTaskCountIsUnderLimit(currentTaskCount, column.wipLimit);
}

function checkTaskCountIsUnderLimit(currentTaskCount: number, wipLimit: number) {
  if (currentTaskCount >= wipLimit) {
    throw new ConflictError(
      `Esta columna alcanzó su límite WIP de ${wipLimit} tarea(s) (tiene ${currentTaskCount} actualmente).`,
    );
  }
}
