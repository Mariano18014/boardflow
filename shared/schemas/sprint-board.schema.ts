import type { SprintStatus, TaskPriority } from "../types/enums";
import type { AssigneeSummary } from "./task-assignee.schema";
import type { LabelSummary } from "./task-label.schema";

export type SprintBoardTaskItem = {
  id: string;
  title: string;
  priority: TaskPriority;
  estimatedPoints: number | null;
  position: number;
  assignees: AssigneeSummary[];
  labels: LabelSummary[];
};

export type SprintBoardColumn = {
  id: string;
  name: string;
  position: number;
  wipLimit: number | null;
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
