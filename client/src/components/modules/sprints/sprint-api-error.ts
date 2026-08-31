export class SprintApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildSprintApiError(
  response: Response,
  fallbackMessage: string,
): Promise<SprintApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new SprintApiError(message, body?.fieldErrors);
}
