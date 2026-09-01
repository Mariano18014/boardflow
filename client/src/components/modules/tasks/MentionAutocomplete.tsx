import { findActiveMembersWithUser } from "@/components/modules/members/active-members.util";
import { useOrganizationMembers } from "@/components/modules/members/use-organization-members";
import type { OrganizationMember } from "@/components/modules/members/list-organization-members.api";
import { AssigneeAvatar } from "./AssigneeAvatar";
import type { AssigneeSummary } from "./assignee-summary";

const MAX_SUGGESTIONS = 5;

type MentionAutocompleteProps = {
  organizationId: string;
  query: string;
  onSelectMember: (member: AssigneeSummary) => void;
};

export function MentionAutocomplete({ organizationId, query, onSelectMember }: MentionAutocompleteProps) {
  const { data: members } = useOrganizationMembers(organizationId);
  const matches = findMatchingActiveMembers(members ?? [], query);

  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-popover p-1 shadow-md">
      {matches.map((member) => (
        <button
          key={member.id}
          type="button"
          onClick={() => onSelectMember(member)}
          className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
        >
          <AssigneeAvatar assignee={member} />
          <span>{member.fullName}</span>
        </button>
      ))}
    </div>
  );
}

function findMatchingActiveMembers(members: OrganizationMember[], query: string): AssigneeSummary[] {
  const activeMembers = findActiveMembersWithUser(members);
  const lowerCaseQuery = query.toLowerCase();
  const matchingMembers = activeMembers.filter((member) =>
    buildMemberDisplayName(member).toLowerCase().includes(lowerCaseQuery),
  );
  return matchingMembers.slice(0, MAX_SUGGESTIONS).map(mapMemberToAssigneeSummary);
}

function buildMemberDisplayName(member: OrganizationMember): string {
  return member.fullName ?? member.email;
}

function mapMemberToAssigneeSummary(member: OrganizationMember): AssigneeSummary {
  return {
    id: member.userId as string,
    fullName: buildMemberDisplayName(member),
    avatarUrl: member.avatarUrl,
  };
}
