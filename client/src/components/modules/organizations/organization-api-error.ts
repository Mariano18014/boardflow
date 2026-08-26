export class OrganizationApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildOrganizationApiError(
  response: Response,
  fallbackMessage: string,
): Promise<OrganizationApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new OrganizationApiError(message, body?.fieldErrors);
}
