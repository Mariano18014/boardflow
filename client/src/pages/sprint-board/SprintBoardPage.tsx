import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { useSprintBoard } from "@/components/modules/tasks/use-sprint-board";
import { SprintBoardView } from "@/components/modules/tasks/SprintBoardView";

export default function SprintBoardPage() {
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();
  const { data: project } = useProject(projectId);
  const { hasPermission } = useHasPermission(project?.organizationId);
  const canEditTasks = hasPermission("tasks:edit");
  const { data: board, isLoading, isError, error } = useSprintBoard(
    project?.organizationId,
    projectId,
    sprintId,
  );

  return (
    <AppShell title="Tablero del sprint">
      <div className="p-7">
        {isLoading && <p className="text-sm text-muted-foreground">Cargando tablero...</p>}
        {isError && (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "No se pudo cargar el tablero de este sprint."}
          </p>
        )}
        {board && project && (
          <SprintBoardView
            organizationId={project.organizationId}
            projectId={project.id}
            sprintId={sprintId}
            board={board}
            canEditTasks={canEditTasks}
          />
        )}
      </div>
    </AppShell>
  );
}
