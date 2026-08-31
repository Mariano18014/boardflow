import { Badge } from "@/components/ui/badge";
import { SelectContent, SelectItem } from "@/components/ui/select";
import type { RoleSummary } from "./list-roles.api";

type RoleSelectOptionsProps = {
  roles: RoleSummary[] | undefined;
};

export function RoleSelectOptions({ roles }: RoleSelectOptionsProps) {
  return (
    <SelectContent>
      {roles?.map((role) => (
        <SelectItem key={role.id} value={role.id}>
          {renderRoleOption(role)}
        </SelectItem>
      ))}
    </SelectContent>
  );
}

function renderRoleOption(role: RoleSummary) {
  return (
    <span className="flex items-center gap-2">
      <span>{role.name}</span>
      {role.isSystem && (
        <Badge variant="secondary" className="text-[10px]">
          Sistema
        </Badge>
      )}
    </span>
  );
}
