export class RolesApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildRolesApiError(
  response: Response,
  fallbackMessage: string,
): Promise<RolesApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new RolesApiError(message, body?.fieldErrors);
}
