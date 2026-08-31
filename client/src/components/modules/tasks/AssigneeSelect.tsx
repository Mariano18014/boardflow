import { Label } from "@/components/ui/label";
import { AssigneeSelectRow } from "./AssigneeSelectRow";
import type { OrganizationMember } from "@/components/modules/members/list-organization-members.api";

type AssigneeSelectProps = {
  members: OrganizationMember[];
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  isReadOnly: boolean;
};

export function AssigneeSelect({ members, selectedUserIds, onChange, isReadOnly }: AssigneeSelectProps) {
  const activeMembers = findActiveMembersWithUser(members);

  function toggleUser(userId: string) {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Asignados</Label>
      <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-md border border-border p-1.5">
        {activeMembers.length === 0 && (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">
            No hay miembros activos en esta organización.
          </p>
        )}
        {activeMembers.map((member) => (
          <AssigneeSelectRow
            key={member.userId as string}
            assignee={{ id: member.userId as string, fullName: member.fullName ?? member.email, avatarUrl: member.avatarUrl }}
            isChecked={selectedUserIds.includes(member.userId as string)}
            onToggle={() => toggleUser(member.userId as string)}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>
    </div>
  );
}

function findActiveMembersWithUser(members: OrganizationMember[]): OrganizationMember[] {
  return members.filter(
    (member) => member.type === "member" && member.status === "ACTIVE" && member.userId !== null,
  );
}
