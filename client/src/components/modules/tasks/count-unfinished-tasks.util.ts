import type { SprintBoardColumn } from "./get-sprint-board.api";

const DONE_COLUMN_NAME = "Done";

export function countUnfinishedTasks(columns: SprintBoardColumn[]): number {
  const unfinishedColumns = columns.filter((column) => column.name !== DONE_COLUMN_NAME);
  return unfinishedColumns.reduce((total, column) => total + column.tasks.length, 0);
}
