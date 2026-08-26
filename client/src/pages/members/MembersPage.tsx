import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteMemberForm } from "@/components/modules/invitations/InviteMemberForm";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";

export default function MembersPage() {
  const { organization } = useCurrentOrganization();
  const canInviteMembers = organization?.roleName === "owner";

  return (
    <AppShell title="Miembros">
      <div className="p-7 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Invitar miembro</CardTitle>
            <CardDescription>
              {canInviteMembers
                ? "Invitá a alguien por email a esta organización."
                : "Solo el owner de la organización puede invitar miembros."}
            </CardDescription>
          </CardHeader>
          {canInviteMembers && organization && (
            <CardContent>
              <InviteMemberForm organizationId={organization.id} />
            </CardContent>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
