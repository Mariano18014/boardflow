import type { CreateBacklogTaskBody } from "@shared/schemas/task.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { BacklogTask } from "./list-backlog.api";

export async function createBacklogTask(
  organizationId: string,
  projectId: string,
  input: CreateBacklogTaskBody,
): Promise<BacklogTask> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/backlog/tasks`,
    {
      method: "POST",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudo crear la tarea.");
  }

  const body = await response.json();
  return body.task;
}
