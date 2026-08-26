export class MembersApiError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function buildMembersApiError(
  response: Response,
  fallbackMessage: string,
): Promise<MembersApiError> {
  const body = await response.json().catch(() => null);
  const message = body?.message ?? fallbackMessage;
  return new MembersApiError(message);
}
