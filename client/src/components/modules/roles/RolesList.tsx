import { Badge } from "@/components/ui/badge";
import type { RoleSummary } from "./list-roles.api";

type RolesListProps = {
  roles: RoleSummary[];
};

export function RolesList({ roles }: RolesListProps) {
  if (roles.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay roles.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {roles.map((role) => (
        <li
          key={role.id}
          className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{role.name}</span>
              {role.isSystem && (
                <Badge variant="secondary" className="text-[10px]">
                  Rol del sistema
                </Badge>
              )}
            </div>
            {role.description && (
              <p className="text-xs text-muted-foreground">{role.description}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
