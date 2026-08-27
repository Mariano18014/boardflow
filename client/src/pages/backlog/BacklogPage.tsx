import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { useBacklog } from "@/components/modules/tasks/use-backlog";
import { BacklogList } from "@/components/modules/tasks/BacklogList";
import { CreateBacklogTaskDialog } from "@/components/modules/tasks/CreateBacklogTaskDialog";

export default function BacklogPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);
  const { hasPermission } = useHasPermission(project?.organizationId);
  const canCreateTasks = hasPermission("tasks:create");
  const { data: tasks, isLoading, isError } = useBacklog(project?.organizationId, projectId);

  return (
    <AppShell title="Backlog">
      <div className="p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold mb-1">Backlog</h1>
            <p className="text-sm text-muted-foreground">
              Tareas de {project?.name ?? "este proyecto"} sin sprint asignado.
            </p>
          </div>
          {canCreateTasks && project && (
            <CreateBacklogTaskDialog organizationId={project.organizationId} projectId={project.id} />
          )}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando backlog...</p>}
        {isError && (
          <p className="text-sm text-destructive">No se pudo cargar el backlog de este proyecto.</p>
        )}
        {tasks && <BacklogList tasks={tasks} />}
      </div>
    </AppShell>
  );
}
