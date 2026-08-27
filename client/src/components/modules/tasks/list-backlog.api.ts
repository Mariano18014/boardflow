import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";

export type BacklogTask = {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedPoints: number | null;
  position: number;
  createdAt: string;
  assignees: unknown[];
};

export async function listBacklogTasks(organizationId: string, projectId: string): Promise<BacklogTask[]> {
  const response = await fetch(`/api/organizations/${organizationId}/projects/${projectId}/backlog`, {
    credentials: "include",
    headers: buildAuthorizationHeaders(),
  });

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo cargar el backlog.");
  }

  const body = await response.json();
  return body.tasks;
}
