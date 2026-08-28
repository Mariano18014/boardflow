import type { SprintStatus, TaskPriority } from "../types/enums";

// Composed read-model for the "active sprint board" screen (HU-28) — not a
// persisted entity, so it lives in its own file instead of task.schema.ts or
// column.schema.ts.
export type SprintBoardTaskItem = {
  id: string;
  title: string;
  priority: TaskPriority;
  estimatedPoints: number | null;
  position: number;
  // Both arrays are empty for now: assignees ships in HU-31, labels in Epic 5.
  assignees: unknown[];
  labels: unknown[];
};

export type SprintBoardColumn = {
  id: string;
  name: string;
  position: number;
  tasks: SprintBoardTaskItem[];
};

export type SprintBoardSprint = {
  id: string;
  name: string;
  goal: string | null;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
};

export type SprintBoard = {
  sprint: SprintBoardSprint;
  columns: SprintBoardColumn[];
};
