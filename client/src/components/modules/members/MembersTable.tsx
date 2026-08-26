import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MemberRow } from "./MemberRow";
import type { OrganizationMember } from "./list-organization-members.api";

type MembersTableProps = {
  members: OrganizationMember[];
  organizationId: string;
  canManageRoles: boolean;
};

export function MembersTable({ members, organizationId, canManageRoles }: MembersTableProps) {
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay más integrantes en esta organización.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <MemberRow
            key={`${member.type}-${member.id}`}
            member={member}
            organizationId={organizationId}
            canManageRoles={canManageRoles}
          />
        ))}
      </TableBody>
    </Table>
  );
}
