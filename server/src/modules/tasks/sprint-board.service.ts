import type { Column, Sprint, Task } from "@prisma/client";
import type {
  SprintBoard,
  SprintBoardColumn,
  SprintBoardSprint,
  SprintBoardTaskItem,
} from "@shared/schemas/sprint-board.schema";
import { NotFoundError } from "../../lib/errors";
import { findProjectById } from "../../services/project.service";
import { checkSprintIsActive, findSprintById } from "../sprints/sprints.service";
import { checkRequesterHasPermission } from "../permissions/check-permission";
import { calculateNextPosition } from "../../lib/next-position.util";
import { findActiveBoardsByProjectId } from "../boards/boards.repository";
import { ensureDefaultColumnsExist } from "../boards/columns/columns.service";
import { findColumnsByBoardId } from "../boards/columns/columns.repository";
import { findAssigneesByTaskId } from "./assignees/assignees.service";
import {
  findColumnTasksForSprint,
  findMaxPositionInColumn,
  findSprintTasksWithoutColumn,
  updateTaskColumnAssignment as saveTaskColumnAssignment,
} from "./tasks.repository";

const DEFAULT_COLUMN_POSITION = 0;

export type GetSprintBoardInput = {
  organizationId: string;
  projectId: string;
  sprintId: string;
};

export async function getSprintBoard(input: GetSprintBoardInput, requesterId: string): Promise<SprintBoard> {
  await checkRequesterHasPermission(input.organizationId, requesterId, "boards:view");
  // findSprintById only confirms the sprint belongs to projectId — it says
  // nothing about projectId belonging to organizationId, so this extra check
  // (same as every other module in this codebase) is what actually prevents
  // cross-organization access.
  await findProjectById(input.projectId, input.organizationId);
  const sprint = await findSprintById(input.sprintId, input.projectId);
  checkSprintIsActive(sprint);
  const board = await findProjectBoard(input.projectId);
  await ensureDefaultColumnsExist(board.id);
  await ensureSprintTasksHaveColumnAssigned(sprint.id, board.id);
  const columns = await buildBoardColumnsWithTasks(board.id, sprint.id);
  return { sprint: mapSprintForBoard(sprint), columns };
}

async function findProjectBoard(projectId: string): Promise<{ id: string }> {
  const boards = await findActiveBoardsByProjectId(projectId);
  const board = boards[0];
  if (!board) {
    throw new NotFoundError("Este proyecto todavía no tiene un tablero. Creá uno primero.");
  }
  return board;
}

async function ensureSprintTasksHaveColumnAssigned(sprintId: string, boardId: string) {
  const tasksWithoutColumn = await findSprintTasksWithoutColumn(sprintId);
  if (tasksWithoutColumn.length === 0) {
    return;
  }
  const defaultColumn = await findDefaultColumn(boardId);
  await assignTasksToDefaultColumn(tasksWithoutColumn, boardId, defaultColumn.id);
}

async function findDefaultColumn(boardId: string): Promise<Column> {
  const columns = await findColumnsByBoardId(boardId);
  const defaultColumn = columns.find((column) => column.position === DEFAULT_COLUMN_POSITION);
  if (!defaultColumn) {
    throw new NotFoundError("El tablero no tiene una columna inicial configurada.");
  }
  return defaultColumn;
}

async function assignTasksToDefaultColumn(tasks: Task[], boardId: string, columnId: string) {
  for (const task of tasks) {
    const nextPosition = await calculateNextPosition(() => findMaxPositionInColumn(columnId));
    await saveTaskColumnAssignment(task.id, boardId, columnId, nextPosition);
  }
}

async function buildBoardColumnsWithTasks(boardId: string, sprintId: string): Promise<SprintBoardColumn[]> {
  const columns = await findColumnsByBoardId(boardId);
  const columnsWithTasks: SprintBoardColumn[] = [];
  for (const column of columns) {
    const tasks = await findColumnTasksForSprint(column.id, sprintId);
    columnsWithTasks.push(await mapColumnWithTasks(column, tasks));
  }
  return columnsWithTasks;
}

async function mapColumnWithTasks(column: Column, tasks: Task[]): Promise<SprintBoardColumn> {
  return {
    id: column.id,
    name: column.name,
    position: column.position,
    tasks: await Promise.all(tasks.map(mapTaskToBoardItem)),
  };
}

async function mapTaskToBoardItem(task: Task): Promise<SprintBoardTaskItem> {
  const assignees = await findAssigneesByTaskId(task.id);
  return {
    id: task.id,
    title: task.title,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    position: task.position,
    assignees,
    labels: [],
  };
}

function mapSprintForBoard(sprint: Sprint): SprintBoardSprint {
  return {
    id: sprint.id,
    name: sprint.name,
    goal: sprint.goal,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    status: sprint.status,
  };
}
