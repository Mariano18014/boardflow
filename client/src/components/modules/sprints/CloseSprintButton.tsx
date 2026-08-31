import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useCloseSprint } from "./use-close-sprint";
import { SprintApiError } from "./sprint-api-error";
import type { SprintSummary } from "./list-sprints.api";

type CloseSprintButtonProps = {
  organizationId: string;
  projectId: string;
  sprintId: string;
  canEditSprints: boolean;
  unfinishedTaskCount: number;
  onSprintClosed: (sprint: SprintSummary) => void;
};

export function CloseSprintButton({
  organizationId,
  projectId,
  sprintId,
  canEditSprints,
  unfinishedTaskCount,
  onSprintClosed,
}: CloseSprintButtonProps) {
  const { closeSprint, isClosingSprint } = useCloseSprint(organizationId, projectId, sprintId);
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function requestClose() {
    setIsConfirmOpen(true);
  }

  function cancelClose() {
    setIsConfirmOpen(false);
  }

  function confirmClose() {
    closeSprint(undefined, {
      onSuccess: (sprint) => {
        setIsConfirmOpen(false);
        onSprintClosed(sprint);
      },
      onError: (error) => {
        setIsConfirmOpen(false);
        toast({
          variant: "destructive",
          title: "No se pudo cerrar el sprint",
          description: error instanceof SprintApiError ? error.message : "Probá de nuevo.",
        });
      },
    });
  }

  const button = (
    <Button variant="outline" onClick={requestClose} disabled={!canEditSprints || isClosingSprint}>
      Cerrar sprint
    </Button>
  );

  return (
    <>
      {canEditSprints ? (
        button
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{button}</span>
          </TooltipTrigger>
          <TooltipContent>No tenés permiso para cerrar sprints.</TooltipContent>
        </Tooltip>
      )}
      <ConfirmDialog
        open={isConfirmOpen}
        title="Cerrar sprint"
        description={describeCloseConfirmation(unfinishedTaskCount)}
        confirmLabel="Cerrar sprint"
        onConfirm={confirmClose}
        onCancel={cancelClose}
      />
    </>
  );
}

function describeCloseConfirmation(unfinishedTaskCount: number): string {
  if (unfinishedTaskCount === 0) {
    return "Todas las tareas del sprint están en Done. ¿Confirmás cerrarlo?";
  }
  if (unfinishedTaskCount === 1) {
    return "1 tarea no está en Done y va a volver al backlog. ¿Confirmás cerrar el sprint?";
  }
  return `${unfinishedTaskCount} tareas no están en Done y van a volver al backlog. ¿Confirmás cerrar el sprint?`;
}
