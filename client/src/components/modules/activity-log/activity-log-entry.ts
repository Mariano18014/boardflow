import type { AssigneeSummary } from "@/components/modules/tasks/assignee-summary";

export type ActivityLogEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  summary: string;

  actor: AssigneeSummary;
};
