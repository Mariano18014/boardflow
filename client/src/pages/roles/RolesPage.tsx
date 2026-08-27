import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRoleForm } from "@/components/modules/roles/CreateRoleForm";
import { RolePermissionsPanel } from "@/components/modules/roles/RolePermissionsPanel";
import { RolesList } from "@/components/modules/roles/RolesList";
import { useRoles } from "@/components/modules/roles/use-roles";
import type { RoleSummary } from "@/components/modules/roles/list-roles.api";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";

export default function RolesPage() {
  const { organization } = useCurrentOrganization();
  const { hasPermission } = useHasPermission(organization?.id);
  const canCreateRoles = hasPermission("roles:create");
  const canEditRolePermissions = hasPermission("roles:edit");
  const { data: roles, isLoading, isError } = useRoles(organization?.id);
  const [selectedRole, setSelectedRole] = useState<RoleSummary | undefined>(undefined);

  return (
    <AppShell title="Roles y permisos">
      <div className="p-7 flex flex-col md:flex-row gap-6">
        <Card className="w-full md:max-w-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-lg">Roles</CardTitle>
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
            {roles && (
              <RolesList
                roles={roles}
                selectedRoleId={selectedRole?.id}
                onSelectRole={setSelectedRole}
              />
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Permisos</CardTitle>
            <CardDescription>
              {selectedRole
                ? `Permisos del rol "${selectedRole.name}".`
                : "Elegí un rol para ver y editar sus permisos."}
            </CardDescription>
          </CardHeader>
          {selectedRole && organization && (
            <CardContent>
              <RolePermissionsPanel
                organizationId={organization.id}
                role={selectedRole}
                canEditPermissions={canEditRolePermissions}
              />
            </CardContent>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
