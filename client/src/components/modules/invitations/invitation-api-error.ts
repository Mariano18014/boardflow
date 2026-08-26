export class InvitationApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildInvitationApiError(
  response: Response,
  fallbackMessage: string,
): Promise<InvitationApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new InvitationApiError(message, body?.fieldErrors);
}
