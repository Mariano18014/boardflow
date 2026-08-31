import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { buildTaskApiError } from "./task-api-error";
import type { LabelSummary } from "./label-summary";

export async function replaceTaskLabels(
  organizationId: string,
  projectId: string,
  taskId: string,
  labelIds: string[],
): Promise<LabelSummary[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}/labels`,
    {
      method: "PUT",
      headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ labelIds }),
    },
  );

  if (!response.ok) {
    throw await buildTaskApiError(response, "No se pudieron guardar los labels.");
  }

  const body = await response.json();
  return body.labels;
}
