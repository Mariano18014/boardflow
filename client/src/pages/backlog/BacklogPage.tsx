import { useState } from "react";
import { Link, useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { useBacklog } from "@/components/modules/tasks/use-backlog";
import { BacklogList } from "@/components/modules/tasks/BacklogList";
import { CreateBacklogTaskDialog } from "@/components/modules/tasks/CreateBacklogTaskDialog";
import { CreateSprintDialog } from "@/components/modules/sprints/CreateSprintDialog";
import { TaskDetailPanel } from "@/components/modules/tasks/TaskDetailPanel";

export default function BacklogPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);
  const { hasPermission } = useHasPermission(project?.organizationId);
  const canCreateTasks = hasPermission("tasks:create");
  const canEditTasks = hasPermission("tasks:edit");
  const canCreateSprints = hasPermission("sprints:create");
  const { data: tasks, isLoading, isError } = useBacklog(project?.organizationId, projectId);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return (
    <AppShell title="Backlog">
      <div className="p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold mb-1">Backlog</h1>
            <p className="text-sm text-muted-foreground">
              Tareas de {project?.name ?? "este proyecto"} sin sprint asignado.
            </p>
            {project && (
              <Link
                href={`/projects/${project.id}/sprint-planning`}
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Ir a Sprint Planning
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canCreateSprints && project && (
              <CreateSprintDialog organizationId={project.organizationId} projectId={project.id} />
            )}
            {canCreateTasks && project && (
              <CreateBacklogTaskDialog organizationId={project.organizationId} projectId={project.id} />
            )}
          </div>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando backlog...</p>}
        {isError && (
          <p className="text-sm text-destructive">No se pudo cargar el backlog de este proyecto.</p>
        )}
        {tasks && project && (
          <BacklogList
            tasks={tasks}
            organizationId={project.organizationId}
            projectId={project.id}
            canEditTasks={canEditTasks}
            onOpenDetail={setSelectedTaskId}
          />
        )}
      </div>
      {project && (
        <TaskDetailPanel
          organizationId={project.organizationId}
          projectId={project.id}
          taskId={selectedTaskId}
          canEditTasks={canEditTasks}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </AppShell>
  );
}
