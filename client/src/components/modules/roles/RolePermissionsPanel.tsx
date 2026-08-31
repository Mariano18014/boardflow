import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/components/modules/permissions/use-permissions";
import { PermissionsMatrix } from "./PermissionsMatrix";
import { useRolePermissions } from "./use-role-permissions";
import { useReplaceRolePermissions } from "./use-replace-role-permissions";
import { RolesApiError } from "./roles-api-error";
import type { RoleSummary } from "./list-roles.api";

const OWNER_ROLE_NAME = "owner";

type RolePermissionsPanelProps = {
  organizationId: string;
  role: RoleSummary;
  canEditPermissions: boolean;
};

export function RolePermissionsPanel({
  organizationId,
  role,
  canEditPermissions,
}: RolePermissionsPanelProps) {
  const { toast } = useToast();
  const { data: permissions, isLoading: isLoadingPermissions } = usePermissions();
  const { data: assignedPermissionIds, isLoading: isLoadingRolePermissions } = useRolePermissions(
    organizationId,
    role.id,
  );
  const { replaceRolePermissions, isPending } = useReplaceRolePermissions(organizationId, role.id);
  const [checkedPermissionIds, setCheckedPermissionIds] = useState<Set<string>>(new Set());

  const isOwnerRole = role.name.toLowerCase() === OWNER_ROLE_NAME;
  const isReadOnly = isOwnerRole || !canEditPermissions;

  useEffect(() => {
    setCheckedPermissionIds(new Set(assignedPermissionIds ?? []));
  }, [assignedPermissionIds, role.id]);

  function toggleChecked(permissionId: string) {
    setCheckedPermissionIds((current) => buildToggledPermissionIds(current, permissionId));
  }

  function handleSave() {
    replaceRolePermissions(Array.from(checkedPermissionIds), {
      onSuccess: () => {
        toast({
          title: "Permisos guardados",
          description: `Se actualizaron los permisos de "${role.name}".`,
        });
      },
      onError: (error) => {
        const message =
          error instanceof RolesApiError ? error.message : "No se pudieron guardar los permisos.";
        toast({ variant: "destructive", title: "No se pudo guardar", description: message });
      },
    });
  }

  if (isLoadingPermissions || isLoadingRolePermissions) {
    return <p className="text-sm text-muted-foreground">Cargando permisos...</p>;
  }

  if (!permissions) {
    return <p className="text-sm text-destructive">No se pudo cargar el catálogo de permisos.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {isOwnerRole && (
        <p className="text-sm text-muted-foreground">
          El rol "Owner" tiene acceso total implícito y no se gestiona asignándole permisos.
        </p>
      )}
      <PermissionsMatrix
        permissions={permissions}
        checkedPermissionIds={checkedPermissionIds}
        onToggle={toggleChecked}
        isReadOnly={isReadOnly}
      />
      {!isReadOnly && (
        <Button onClick={handleSave} disabled={isPending} className="w-fit">
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      )}
    </div>
  );
}

function buildToggledPermissionIds(current: Set<string>, permissionId: string): Set<string> {
  const next = new Set(current);
  if (next.has(permissionId)) {
    next.delete(permissionId);
  } else {
    next.add(permissionId);
  }
  return next;
}
