import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PermissionSummary } from "@/components/modules/permissions/list-permissions.api";

const ACTION_ORDER = ["view", "create", "edit", "delete"] as const;

const ACTION_LABELS: Record<string, string> = {
  view: "Ver",
  create: "Crear",
  edit: "Editar",
  delete: "Eliminar",
};

const RESOURCE_LABELS: Record<string, string> = {
  organizations: "Organización",
  members: "Miembros",
  roles: "Roles",
  projects: "Proyectos",
  boards: "Tableros",
  sprints: "Sprints",
  tasks: "Tareas",
};

type PermissionsMatrixProps = {
  permissions: PermissionSummary[];
  checkedPermissionIds: Set<string>;
  onToggle: (permissionId: string) => void;
  isReadOnly: boolean;
};

export function PermissionsMatrix({
  permissions,
  checkedPermissionIds,
  onToggle,
  isReadOnly,
}: PermissionsMatrixProps) {
  const resources = buildResourceOrder(permissions);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Recurso</TableHead>
          {ACTION_ORDER.map((action) => (
            <TableHead key={action} className="text-center">
              {ACTION_LABELS[action]}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource) => (
          <TableRow key={resource}>
            <TableCell className="text-sm font-medium">
              {RESOURCE_LABELS[resource] ?? resource}
            </TableCell>
            {ACTION_ORDER.map((action) => {
              const permission = findPermission(permissions, resource, action);
              if (!permission) {
                return <TableCell key={action} />;
              }
              return (
                <TableCell key={action} className="text-center">
                  <Checkbox
                    checked={checkedPermissionIds.has(permission.id)}
                    onCheckedChange={() => onToggle(permission.id)}
                    disabled={isReadOnly}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function buildResourceOrder(permissions: PermissionSummary[]): string[] {
  const resources = permissions.map((permission) => permission.resource);
  return Array.from(new Set(resources));
}

function findPermission(
  permissions: PermissionSummary[],
  resource: string,
  action: string,
): PermissionSummary | undefined {
  return permissions.find((permission) => permission.resource === resource && permission.action === action);
}
