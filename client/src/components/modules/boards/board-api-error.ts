export class BoardApiError extends Error {
  fieldErrors?: Record<string, string[] | undefined>;

  constructor(message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export async function buildBoardApiError(
  response: Response,
  fallbackMessage: string,
): Promise<BoardApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new BoardApiError(message, body?.fieldErrors);
}
