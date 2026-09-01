import type { Over } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { SprintBoardColumn, SprintBoardTask } from "./get-sprint-board.api";

export type TaskMove = {
  taskId: string;
  sourceColumnId: string;
  destinationColumnId: string;
  destinationIndex: number;
};

export function resolveDropTarget(
  over: Over,
  columns: SprintBoardColumn[],
): { columnId: string; index: number } | undefined {
  const overId = over.id as string;
  const droppedOnColumn = columns.find((column) => column.id === overId);
  if (droppedOnColumn) {
    return { columnId: droppedOnColumn.id, index: droppedOnColumn.tasks.length };
  }
  for (const column of columns) {
    const taskIndex = column.tasks.findIndex((task) => task.id === overId);
    if (taskIndex !== -1) {
      return { columnId: column.id, index: taskIndex };
    }
  }
  return undefined;
}

export function moveTaskAcrossColumns(columns: SprintBoardColumn[], move: TaskMove): SprintBoardColumn[] {
  if (move.sourceColumnId === move.destinationColumnId) {
    return reorderTaskWithinColumn(columns, move);
  }
  return moveTaskBetweenColumns(columns, move);
}

function reorderTaskWithinColumn(columns: SprintBoardColumn[], move: TaskMove): SprintBoardColumn[] {
  return columns.map((column) => {
    if (column.id !== move.sourceColumnId) {
      return column;
    }
    const oldIndex = column.tasks.findIndex((task) => task.id === move.taskId);
    if (oldIndex === -1) {
      return column;
    }
    return { ...column, tasks: arrayMove(column.tasks, oldIndex, move.destinationIndex) };
  });
}

function moveTaskBetweenColumns(columns: SprintBoardColumn[], move: TaskMove): SprintBoardColumn[] {
  const task = findTaskInColumns(columns, move.taskId);
  if (!task) {
    return columns;
  }
  return columns.map((column) => {
    if (column.id === move.sourceColumnId) {
      return { ...column, tasks: column.tasks.filter((item) => item.id !== move.taskId) };
    }
    if (column.id === move.destinationColumnId) {
      return { ...column, tasks: insertTaskAtIndex(column.tasks, task, move.destinationIndex) };
    }
    return column;
  });
}

function findTaskInColumns(columns: SprintBoardColumn[], taskId: string): SprintBoardTask | undefined {
  for (const column of columns) {
    const task = column.tasks.find((item) => item.id === taskId);
    if (task) {
      return task;
    }
  }
  return undefined;
}

function insertTaskAtIndex(tasks: SprintBoardTask[], task: SprintBoardTask, index: number): SprintBoardTask[] {
  const clampedIndex = Math.max(0, Math.min(index, tasks.length));
  const result = [...tasks];
  result.splice(clampedIndex, 0, task);
  return result;
}
