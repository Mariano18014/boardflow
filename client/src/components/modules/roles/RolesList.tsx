import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RoleSummary } from "./list-roles.api";

type RolesListProps = {
  roles: RoleSummary[];
  selectedRoleId?: string;
  onSelectRole?: (role: RoleSummary) => void;
};

export function RolesList({ roles, selectedRoleId, onSelectRole }: RolesListProps) {
  if (roles.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay roles.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {roles.map((role) => (
        <li key={role.id}>
          <button
            type="button"
            onClick={() => onSelectRole?.(role)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left",
              selectedRoleId === role.id
                ? "border-primary bg-accent"
                : "border-border hover:bg-accent/50",
            )}
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
          </button>
        </li>
      ))}
    </ul>
  );
}
