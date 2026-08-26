import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/utils";
import type { OrganizationMember } from "./list-organization-members.api";
import { MemberRoleSelect } from "./MemberRoleSelect";
import { RemoveMemberButton } from "./RemoveMemberButton";

type MemberRowProps = {
  member: OrganizationMember;
  organizationId: string;
  canManageMembers: boolean;
};

export function MemberRow({ member, organizationId, canManageMembers }: MemberRowProps) {
  const displayName = member.fullName ?? member.email;
  const isActiveMember = member.type === "member" && member.status === "ACTIVE";
  const showRoleSelect = canManageMembers && isActiveMember;
  const showRemoveButton = canManageMembers && isActiveMember;

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={displayName} />}
            <AvatarFallback className="text-xs font-heading font-semibold">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate">{displayName}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
      <TableCell className="text-sm">
        {showRoleSelect ? (
          <MemberRoleSelect
            organizationId={organizationId}
            membershipId={member.id}
            currentRoleId={member.roleId}
            memberDisplayName={displayName}
          />
        ) : (
          member.roleName
        )}
      </TableCell>
      <TableCell>
        <MemberStatusBadge status={member.status} />
      </TableCell>
      <TableCell>
        {showRemoveButton && (
          <RemoveMemberButton
            organizationId={organizationId}
            membershipId={member.id}
            memberDisplayName={displayName}
          />
        )}
      </TableCell>
    </TableRow>
  );
}

function MemberStatusBadge({ status }: { status: string }) {
  const { label, variant } = describeMemberStatus(status);
  return <Badge variant={variant}>{label}</Badge>;
}

function describeMemberStatus(status: string): { label: string; variant: BadgeProps["variant"] } {
  switch (status) {
    case "ACTIVE":
      return { label: "Activo", variant: "default" };
    case "SUSPENDED":
      return { label: "Suspendido", variant: "destructive" };
    case "INVITED":
      return { label: "Invitado", variant: "secondary" };
    case "PENDING":
      return { label: "Invitación pendiente", variant: "outline" };
    default:
      return { label: status, variant: "outline" };
  }
}
