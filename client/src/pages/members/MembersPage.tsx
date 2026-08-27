import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteMemberForm } from "@/components/modules/invitations/InviteMemberForm";
import { MembersTable } from "@/components/modules/members/MembersTable";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";
import { useOrganizationMembers } from "@/components/modules/members/use-organization-members";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";

export default function MembersPage() {
  const { organization } = useCurrentOrganization();
  const { hasPermission } = useHasPermission(organization?.id);
  const canInviteMembers = hasPermission("members:create");
  const canEditMemberRole = hasPermission("members:edit");
  const canRemoveMembers = hasPermission("members:delete");
  const { data: members, isLoading, isError } = useOrganizationMembers(organization?.id);

  return (
    <AppShell title="Miembros">
      <div className="p-7 flex flex-col gap-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Invitar miembro</CardTitle>
            <CardDescription>
              {canInviteMembers
                ? "Invitá a alguien por email a esta organización."
                : "No tenés permiso para invitar miembros."}
            </CardDescription>
          </CardHeader>
          {canInviteMembers && organization && (
            <CardContent>
              <InviteMemberForm organizationId={organization.id} />
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Integrantes</CardTitle>
            <CardDescription>Quién forma parte de esta organización.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Cargando integrantes...</p>}
            {isError && (
              <p className="text-sm text-destructive">No se pudo cargar el listado de integrantes.</p>
            )}
            {members && organization && (
              <MembersTable
                members={members}
                organizationId={organization.id}
                canEditMemberRole={canEditMemberRole}
                canRemoveMembers={canRemoveMembers}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
