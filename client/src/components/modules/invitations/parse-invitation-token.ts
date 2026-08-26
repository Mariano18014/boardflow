export function parseInvitationTokenFromQueryString(search: string): string | null {
  return new URLSearchParams(search).get("token");
}
