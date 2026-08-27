import { Button } from "@/components/ui/button";
import { useRestoreProject } from "./use-restore-project";

type RestoreProjectButtonProps = {
  organizationId: string;
  projectId: string;
};

export function RestoreProjectButton({ organizationId, projectId }: RestoreProjectButtonProps) {
  const { restoreProject, isPending } = useRestoreProject(organizationId);

  function requestRestore() {
    restoreProject(projectId);
  }

  return (
    <Button variant="outline" size="sm" onClick={requestRestore} disabled={isPending}>
      Restaurar
    </Button>
  );
}
