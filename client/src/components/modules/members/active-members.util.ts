import type { OrganizationMember } from "./list-organization-members.api";

export function findActiveMembersWithUser(members: OrganizationMember[]): OrganizationMember[] {
  return members.filter(
    (member) => member.type === "member" && member.status === "ACTIVE" && member.userId !== null,
  );
}
