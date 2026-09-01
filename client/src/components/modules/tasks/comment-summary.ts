import type { AssigneeSummary } from "./assignee-summary";

export type TaskComment = {
  id: string;
  taskId: string;
  content: string;
  editedAt: string | null;
  createdAt: string;
  // Same shape as AssigneeSummary (id, fullName, avatarUrl) — reused directly
  // so CommentItem can render it with the existing AssigneeAvatar component.
  author: AssigneeSummary;
};
