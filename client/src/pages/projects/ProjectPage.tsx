import { Link, useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { CreateBoardDialog } from "@/components/modules/boards/CreateBoardDialog";
import { BoardsList } from "@/components/modules/boards/BoardsList";
import { useBoards } from "@/components/modules/boards/use-boards";
import { useActiveSprint } from "@/components/modules/sprints/use-sprints";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, isError } = useProject(projectId);
  const { hasPermission } = useHasPermission(project?.organizationId);
  const canCreateBoards = hasPermission("boards:create");
  const canEditBoards = hasPermission("boards:edit");
  const { data: boards } = useBoards(project?.organizationId, project?.id);

  const { data: activeSprint, isLoading: isLoadingActiveSprint } = useActiveSprint(
    project?.organizationId,
    project?.id,
  );

  return (
    <AppShell title={project?.name ?? "Proyecto"}>
      <div className="p-7">
        {isLoading && <p className="text-sm text-muted-foreground">Cargando proyecto...</p>}
        {isError && (
          <p className="text-sm text-muted-foreground">No se pudo cargar este proyecto.</p>
        )}
        {project && (
          <>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-mono text-text-3">{project.key}</div>
              {canCreateBoards && (
                <CreateBoardDialog
                  organizationId={project.organizationId}
                  projectId={project.id}
                  activeSprintId={activeSprint?.id}
                />
              )}
            </div>
            <h1 className="font-heading text-xl font-bold mb-1">{project.name}</h1>
            <Link
              href={`/projects/${project.id}/backlog`}
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Ver backlog
            </Link>

            <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-text-3 mt-6 mb-2.5">
              Tableros
            </h2>
            {boards && boards.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Todavía no hay tableros en este proyecto.
              </p>
            )}
            {boards && boards.length > 0 && (
              <BoardsList
                boards={boards}
                organizationId={project.organizationId}
                projectId={project.id}
                canEditBoards={canEditBoards}
                activeSprintId={activeSprint?.id}
                isLoadingActiveSprint={isLoadingActiveSprint}
              />
            )}

            <Link
              href={`/projects/${project.id}/sprint-planning`}
              className="mt-6 block text-sm text-primary underline-offset-4 hover:underline"
            >
              Ir a Sprint Planning
            </Link>

            <Link
              href={`/projects/${project.id}/labels`}
              className="mt-2 block text-sm text-primary underline-offset-4 hover:underline"
            >
              Gestionar labels
            </Link>
          </>
        )}
      </div>
    </AppShell>
  );
}
