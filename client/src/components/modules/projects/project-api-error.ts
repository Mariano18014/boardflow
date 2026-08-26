export class ProjectApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildProjectApiError(
  response: Response,
  fallbackMessage: string,
): Promise<ProjectApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new ProjectApiError(message, body?.fieldErrors);
}
