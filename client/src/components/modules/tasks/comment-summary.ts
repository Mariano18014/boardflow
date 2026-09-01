import type { AssigneeSummary } from "./assignee-summary";

export type TaskComment = {
  id: string;
  taskId: string;
  content: string;
  editedAt: string | null;
  createdAt: string;

  author: AssigneeSummary;
};
