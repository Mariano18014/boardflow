import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { queryClient } from "@/lib/queryClient";
import { useAuthSession } from "@/components/modules/auth/use-auth-session";
import { useProject } from "@/components/modules/projects/use-project";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { useSprintBoard } from "@/components/modules/tasks/use-sprint-board";
import { SprintBoardView } from "@/components/modules/tasks/SprintBoardView";
import { TaskDetailPanel } from "@/components/modules/tasks/TaskDetailPanel";
import { useSprintBoardRealtimeSync } from "@/modules/realtime/use-sprint-board-realtime-sync";
import { useSprintBoardPresence } from "@/modules/realtime/use-sprint-board-presence";

export default function SprintBoardPage() {
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();
  const [, navigate] = useLocation();
  const session = useAuthSession();
  const { data: project } = useProject(projectId);
  const { hasPermission } = useHasPermission(project?.organizationId);
  const canEditTasks = hasPermission("tasks:edit");
  const canEditSprints = hasPermission("sprints:edit");
  const canEditBoards = hasPermission("boards:edit");
  const { data: board, isLoading, isError, error } = useSprintBoard(
    project?.organizationId,
    projectId,
    sprintId,
  );
  useSprintBoardRealtimeSync(sprintId, () => refetchSprintBoard(projectId, sprintId));
  const presentUsers = useSprintBoardPresence(sprintId);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  function handleSprintClosed() {
    navigate(`/projects/${projectId}/sprint-planning`);
  }

  return (
    <AppShell title="Tablero del sprint">
      <div className="p-7">
        {isLoading && <p className="text-sm text-muted-foreground">Cargando tablero...</p>}
        {isError && (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "No se pudo cargar el tablero de este sprint."}
          </p>
        )}
        {board && project && session && (
          <SprintBoardView
            organizationId={project.organizationId}
            projectId={project.id}
            sprintId={sprintId}
            board={board}
            canEditTasks={canEditTasks}
            canEditSprints={canEditSprints}
            canEditBoards={canEditBoards}
            presentUsers={presentUsers}
            currentUserId={session.user.id}
            onOpenTaskDetail={setSelectedTaskId}
            onSprintClosed={handleSprintClosed}
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

function refetchSprintBoard(projectId: string, sprintId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "sprints", sprintId, "board"] });
}
