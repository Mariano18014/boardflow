import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProject } from "@/components/modules/projects/use-project";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { useBacklog } from "@/components/modules/tasks/use-backlog";
import { useSprintTasks } from "@/components/modules/tasks/use-sprint-tasks";
import { SprintPlanningBoard } from "@/components/modules/tasks/SprintPlanningBoard";
import { usePlannedSprints } from "@/components/modules/sprints/use-sprints";

export default function SprintPlanningPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);
  const { hasPermission } = useHasPermission(project?.organizationId);
  const canEditTasks = hasPermission("tasks:edit");

  const { data: plannedSprints, isLoading: isLoadingSprints } = usePlannedSprints(
    project?.organizationId,
    projectId,
  );
  const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedSprintId && plannedSprints && plannedSprints.length > 0) {
      setSelectedSprintId(plannedSprints[0].id);
    }
  }, [plannedSprints, selectedSprintId]);

  const { data: backlogTasks, isLoading: isLoadingBacklog } = useBacklog(
    project?.organizationId,
    projectId,
  );
  const { data: sprintTasks, isLoading: isLoadingSprintTasks } = useSprintTasks(
    project?.organizationId,
    projectId,
    selectedSprintId,
  );

  return (
    <AppShell title="Sprint Planning">
      <div className="p-7">
        <h1 className="font-heading text-xl font-bold mb-1">Sprint Planning</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Elegí un sprint planificado y arrastrá tareas entre el backlog y el sprint.
        </p>

        {isLoadingSprints && <p className="text-sm text-muted-foreground">Cargando sprints...</p>}
        {plannedSprints && plannedSprints.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay sprints planificados en este proyecto. Creá uno desde la pantalla de Backlog.
          </p>
        )}
        {plannedSprints && plannedSprints.length > 0 && (
          <div className="mb-6 max-w-xs">
            <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
              <SelectTrigger>
                <SelectValue placeholder="Elegí un sprint" />
              </SelectTrigger>
              <SelectContent>
                {plannedSprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(isLoadingBacklog || isLoadingSprintTasks) && selectedSprintId && (
          <p className="text-sm text-muted-foreground">Cargando tareas...</p>
        )}
        {project && backlogTasks && sprintTasks && selectedSprintId && (
          <SprintPlanningBoard
            organizationId={project.organizationId}
            projectId={project.id}
            sprintId={selectedSprintId}
            backlogTasks={backlogTasks}
            sprintTasks={sprintTasks}
            canEditTasks={canEditTasks}
          />
        )}
      </div>
    </AppShell>
  );
}
