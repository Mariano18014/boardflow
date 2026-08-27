import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { CreateBoardDialog } from "@/components/modules/boards/CreateBoardDialog";
import { BoardsList } from "@/components/modules/boards/BoardsList";
import { useBoards } from "@/components/modules/boards/use-boards";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, isError } = useProject(projectId);
  const { hasPermission } = useHasPermission(project?.organizationId);
  const canCreateBoards = hasPermission("boards:create");
  const canEditBoards = hasPermission("boards:edit");
  const { data: boards } = useBoards(project?.organizationId, project?.id);

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
                <CreateBoardDialog organizationId={project.organizationId} projectId={project.id} />
              )}
            </div>
            <h1 className="font-heading text-xl font-bold mb-4">{project.name}</h1>

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
              />
            )}

            <p className="mt-6 text-sm text-muted-foreground">
              El backlog y los sprints de este proyecto todavía no están implementados.
            </p>
          </>
        )}
      </div>
    </AppShell>
  );
}
