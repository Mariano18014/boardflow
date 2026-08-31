import type { AssigneeSummary } from "@/components/modules/tasks/assignee-summary";

export type ActivityLogEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  summary: string;
  // Same shape as AssigneeSummary (id, fullName, avatarUrl) — reused directly
  // so ActivityLogEntryItem can render it with the existing AssigneeAvatar
  // component (same pattern as CommentItem's author).
  actor: AssigneeSummary;
};
