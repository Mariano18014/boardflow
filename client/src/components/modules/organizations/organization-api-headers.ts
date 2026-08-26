import { getSession } from "@/components/modules/auth/auth-session.store";

export function buildOrganizationRequestHeaders(): Record<string, string> {
  const session = getSession();
  if (!session) {
    return {};
  }
  return { Authorization: `Bearer ${session.accessToken}` };
}
