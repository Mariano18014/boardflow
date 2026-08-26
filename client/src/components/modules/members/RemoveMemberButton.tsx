import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useRemoveMember } from "./use-remove-member";

type RemoveMemberButtonProps = {
  organizationId: string;
  membershipId: string;
  memberDisplayName: string;
};

export function RemoveMemberButton({
  organizationId,
  membershipId,
  memberDisplayName,
}: RemoveMemberButtonProps) {
  const { removeMember, isPending } = useRemoveMember(organizationId);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function requestRemoval() {
    setIsConfirmOpen(true);
  }

  function cancelRemoval() {
    setIsConfirmOpen(false);
  }

  function confirmRemoval() {
    removeMember(membershipId, { onSettled: () => setIsConfirmOpen(false) });
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={requestRemoval} disabled={isPending}>
        Remover
      </Button>
      <ConfirmDialog
        open={isConfirmOpen}
        title="Remover miembro"
        description={`¿Confirmás remover a ${memberDisplayName} de la organización? No vas a poder deshacer esto desde la interfaz; si hace falta, vas a tener que invitarlo de nuevo.`}
        confirmLabel="Remover"
        isDestructive
        onConfirm={confirmRemoval}
        onCancel={cancelRemoval}
      />
    </>
  );
}
