import type { SprintBoardColumn } from "./get-sprint-board.api";

const DONE_COLUMN_NAME = "Done";

// Pure function: counts, from the board columns already loaded on screen, how
// many tasks are NOT in the "Done" column — i.e. how many would return to the
// backlog if the sprint were closed right now. Kept separate from the confirm
// dialog component so it can be tested without rendering anything.
export function countUnfinishedTasks(columns: SprintBoardColumn[]): number {
  const unfinishedColumns = columns.filter((column) => column.name !== DONE_COLUMN_NAME);
  return unfinishedColumns.reduce((total, column) => total + column.tasks.length, 0);
}
