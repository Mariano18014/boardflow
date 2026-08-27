import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useBacklog } from "@/components/modules/tasks/use-backlog";
import { BacklogList } from "@/components/modules/tasks/BacklogList";

export default function BacklogPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);
  const { data: tasks, isLoading, isError } = useBacklog(project?.organizationId, projectId);

  return (
    <AppShell title="Backlog">
      <div className="p-7">
        <h1 className="font-heading text-xl font-bold mb-1">Backlog</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Tareas de {project?.name ?? "este proyecto"} sin sprint asignado.
        </p>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando backlog...</p>}
        {isError && (
          <p className="text-sm text-destructive">No se pudo cargar el backlog de este proyecto.</p>
        )}
        {tasks && <BacklogList tasks={tasks} />}
      </div>
    </AppShell>
  );
}
