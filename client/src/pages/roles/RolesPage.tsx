import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoleForm } from "@/components/modules/roles/CreateRoleForm";
import { RolesList } from "@/components/modules/roles/RolesList";
import { useRoles } from "@/components/modules/roles/use-roles";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";

export default function RolesPage() {
  const { organization } = useCurrentOrganization();
  const canCreateRoles = organization?.roleName === "owner";
  const { data: roles, isLoading, isError } = useRoles(organization?.id);

  return (
    <AppShell title="Roles y permisos">
      <div className="p-7 max-w-md">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-lg">Roles y permisos</CardTitle>
              <CardDescription>Roles disponibles en esta organización.</CardDescription>
            </div>
            {canCreateRoles && organization && (
              <CreateRoleForm organizationId={organization.id} />
            )}
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Cargando roles...</p>}
            {isError && (
              <p className="text-sm text-destructive">No se pudieron cargar los roles.</p>
            )}
            {roles && <RolesList roles={roles} />}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
