export class TaskApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildTaskApiError(
  response: Response,
  fallbackMessage: string,
): Promise<TaskApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new TaskApiError(message, body?.fieldErrors);
}
