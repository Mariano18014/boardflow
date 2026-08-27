import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useArchiveProject } from "./use-archive-project";

type ArchiveProjectButtonProps = {
  organizationId: string;
  projectId: string;
  projectName: string;
};

export function ArchiveProjectButton({
  organizationId,
  projectId,
  projectName,
}: ArchiveProjectButtonProps) {
  const { archiveProject, isPending } = useArchiveProject(organizationId);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function requestArchive() {
    setIsConfirmOpen(true);
  }

  function cancelArchive() {
    setIsConfirmOpen(false);
  }

  function confirmArchive() {
    archiveProject(projectId, { onSettled: () => setIsConfirmOpen(false) });
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={requestArchive} disabled={isPending}>
        Archivar
      </Button>
      <ConfirmDialog
        open={isConfirmOpen}
        title="Archivar proyecto"
        description={`¿Confirmás archivar "${projectName}"? Vas a poder restaurarlo cuando quieras desde la sección de archivados.`}
        confirmLabel="Archivar"
        isDestructive
        onConfirm={confirmArchive}
        onCancel={cancelArchive}
      />
    </>
  );
}
