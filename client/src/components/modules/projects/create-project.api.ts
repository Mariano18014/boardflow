import type { CreateProjectBody } from "@shared/schemas/project.schema";
import { buildAuthorizationHeaders } from "@/lib/queryClient";
import { clearSession, getSession, setSession } from "@/components/modules/auth/auth-session.store";
import { refreshAccessToken } from "@/components/modules/auth/refresh-token.api";
import { buildProjectApiError, ProjectApiError } from "./project-api-error";

export type CreatedProject = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  organizationId: string;
};

const SESSION_EXPIRED_MESSAGE = "Tu sesión expiró. Iniciá sesión nuevamente.";

export async function createProject(
  organizationId: string,
  input: CreateProjectBody,
): Promise<CreatedProject> {
  const response = await postCreateProjectRequest(organizationId, input);
  if (response.status === 401) {
    const retriedResponse = await retryCreateProjectAfterSessionRefresh(organizationId, input);
    return parseCreateProjectResponse(retriedResponse);
  }
  return parseCreateProjectResponse(response);
}

async function postCreateProjectRequest(
  organizationId: string,
  input: CreateProjectBody,
): Promise<Response> {
  return fetch(`/api/organizations/${organizationId}/projects`, {
    method: "POST",
    headers: { ...buildAuthorizationHeaders(), "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
}

async function retryCreateProjectAfterSessionRefresh(
  organizationId: string,
  input: CreateProjectBody,
): Promise<Response> {
  const session = getSession();
  if (!session) {
    throw new ProjectApiError(SESSION_EXPIRED_MESSAGE);
  }

  try {
    const refreshedSession = await refreshAccessToken(session.refreshToken);
    setSession(refreshedSession);
  } catch {
    clearSession();
    throw new ProjectApiError(SESSION_EXPIRED_MESSAGE);
  }

  return postCreateProjectRequest(organizationId, input);
}

async function parseCreateProjectResponse(response: Response): Promise<CreatedProject> {
  if (!response.ok) {
    throw await buildProjectApiError(response, "No se pudo crear el proyecto.");
  }

  const body = await response.json();
  return body.project;
}
