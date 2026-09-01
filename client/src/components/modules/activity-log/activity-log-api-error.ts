export class ActivityLogApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildActivityLogApiError(
  response: Response,
  fallbackMessage: string,
): Promise<ActivityLogApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new ActivityLogApiError(message, body?.fieldErrors);
}
