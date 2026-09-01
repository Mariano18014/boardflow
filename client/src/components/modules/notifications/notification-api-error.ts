export class NotificationApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildNotificationApiError(
  response: Response,
  fallbackMessage: string,
): Promise<NotificationApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new NotificationApiError(message, body?.fieldErrors);
}
