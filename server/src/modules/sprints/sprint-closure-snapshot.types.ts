import type { TaskPriority } from "@shared/types/enums";

export type SprintSnapshotTask = {
  taskId: string;
  title: string;
  priority: TaskPriority;
  estimatedPoints: number | null;
  columnId: string | null;
  columnName: string | null;
};

export type SprintClosureSnapshot = {
  sprintName: string;
  goal: string | null;
  startDate: string;
  endDate: string;
  totalCommittedPoints: number;
  completedPoints: number;
  tasks: SprintSnapshotTask[];
};
