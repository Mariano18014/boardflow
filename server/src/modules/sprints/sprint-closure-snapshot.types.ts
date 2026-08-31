import type { TaskPriority } from "@shared/types/enums";

// Shape of the metadata stored on the "sprint.closed" ActivityLog record
// (written once, at close time, by recordSprintClosureSnapshot in
// sprints.service.ts) and read back as-is by sprint-history.service.ts.
// Dates are ISO strings (not Date instances) because this is what actually
// gets persisted as JSON.
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
