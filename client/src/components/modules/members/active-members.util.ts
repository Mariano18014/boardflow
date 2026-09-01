import type { OrganizationMember } from "./list-organization-members.api";

// Shared by the assignee selector (HU-31) and the comment mention
// autocomplete (HU-46) — both need the same "real, active member" filter over
// the organization's member list.
export function findActiveMembersWithUser(members: OrganizationMember[]): OrganizationMember[] {
  return members.filter(
    (member) => member.type === "member" && member.status === "ACTIVE" && member.userId !== null,
  );
}
