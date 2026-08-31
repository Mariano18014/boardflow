export class LabelApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildLabelApiError(
  response: Response,
  fallbackMessage: string,
): Promise<LabelApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new LabelApiError(message, body?.fieldErrors);
}
