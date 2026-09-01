export type NotificationEntry = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

export type TaskAssignedPayload = {
  taskId: string;
  taskTitle: string;
  projectId: string;
  organizationId: string;
  assignedByUserId: string;
  assignedByName: string;
};
