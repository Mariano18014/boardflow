export class PermissionsApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function buildPermissionsApiError(
  response: Response,
  fallbackMessage: string,
): Promise<PermissionsApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new PermissionsApiError(message);
}
