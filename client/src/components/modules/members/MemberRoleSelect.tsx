import { useState } from "react";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RoleSelectOptions } from "@/components/modules/roles/RoleSelectOptions";
import { useRoles } from "@/components/modules/roles/use-roles";
import { useChangeMemberRole } from "./use-change-member-role";

type MemberRoleSelectProps = {
  organizationId: string;
  membershipId: string;
  currentRoleId: string;
  memberDisplayName: string;
};

export function MemberRoleSelect({
  organizationId,
  membershipId,
  currentRoleId,
  memberDisplayName,
}: MemberRoleSelectProps) {
  const { data: roles } = useRoles(organizationId);
  const { changeMemberRole, isPending } = useChangeMemberRole(organizationId);
  const [pendingRoleId, setPendingRoleId] = useState<string | null>(null);

  const pendingRole = roles?.find((role) => role.id === pendingRoleId);

  function requestRoleChange(newRoleId: string) {
    if (newRoleId === currentRoleId) {
      return;
    }
    setPendingRoleId(newRoleId);
  }

  function cancelRoleChange() {
    setPendingRoleId(null);
  }

  function confirmRoleChange() {
    if (!pendingRoleId) {
      return;
    }
    changeMemberRole(
      { membershipId, roleId: pendingRoleId },
      { onSettled: () => setPendingRoleId(null) },
    );
  }

  return (
    <>
      <Select
        value={pendingRoleId ?? currentRoleId}
        onValueChange={requestRoleChange}
        disabled={isPending}
      >
        <SelectTrigger className="h-8 w-40 text-xs">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <RoleSelectOptions roles={roles} />
      </Select>

      <ConfirmDialog
        open={pendingRoleId !== null}
        title="Cambiar rol"
        description={`¿Confirmás cambiar el rol de ${memberDisplayName} a "${pendingRole?.name}"?`}
        confirmLabel="Confirmar"
        onConfirm={confirmRoleChange}
        onCancel={cancelRoleChange}
      />
    </>
  );
}
