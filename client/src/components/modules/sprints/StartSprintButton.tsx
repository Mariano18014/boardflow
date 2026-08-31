import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useStartSprint } from "./use-start-sprint";
import { SprintApiError } from "./sprint-api-error";
import type { SprintSummary } from "./list-sprints.api";

type StartSprintButtonProps = {
  organizationId: string;
  projectId: string;
  sprintId: string;
  canEditSprints: boolean;
  activeSprint: SprintSummary | undefined;
  onSprintStarted: (sprint: SprintSummary) => void;
};

export function StartSprintButton({
  organizationId,
  projectId,
  sprintId,
  canEditSprints,
  activeSprint,
  onSprintStarted,
}: StartSprintButtonProps) {
  const { startSprint, isStartingSprint } = useStartSprint(organizationId, projectId);
  const { toast } = useToast();

  const disabledReason = describeDisabledReason(canEditSprints, activeSprint);
  const isDisabled = disabledReason !== undefined || isStartingSprint;

  function handleClick() {
    startSprint(sprintId, {
      onSuccess: onSprintStarted,
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "No se pudo iniciar el sprint",
          description: error instanceof SprintApiError ? error.message : "Probá de nuevo.",
        });
      },
    });
  }

  const button = (
    <Button onClick={handleClick} disabled={isDisabled}>
      Iniciar sprint
    </Button>
  );

  if (!disabledReason) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{button}</span>
      </TooltipTrigger>
      <TooltipContent>{disabledReason}</TooltipContent>
    </Tooltip>
  );
}

function describeDisabledReason(
  canEditSprints: boolean,
  activeSprint: SprintSummary | undefined,
): string | undefined {
  if (!canEditSprints) {
    return "No tenés permiso para iniciar sprints.";
  }
  if (activeSprint) {
    return `Ya hay un sprint activo ("${activeSprint.name}"). Cerralo antes de iniciar uno nuevo.`;
  }
  return undefined;
}
