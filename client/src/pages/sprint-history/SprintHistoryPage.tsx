import { Link, useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useSprintHistory } from "@/components/modules/sprints/use-sprint-history";
import { SprintHistoryColumn } from "@/components/modules/sprints/SprintHistoryColumn";
import { groupSnapshotTasksByColumn } from "@/components/modules/sprints/group-snapshot-tasks-by-column.util";
import type { SprintClosureSnapshot } from "@/components/modules/sprints/get-sprint-history.api";

export default function SprintHistoryPage() {
  const { projectId, sprintId } = useParams<{ projectId: string; sprintId: string }>();
  const { data: project } = useProject(projectId);
  const { data: history, isLoading, isError } = useSprintHistory(
    project?.organizationId,
    projectId,
    sprintId,
  );

  return (
    <AppShell title="Historial del sprint">
      <div className="p-7">
        <Link
          href={`/projects/${projectId}/sprint-planning`}
          className="mb-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
        >
          Volver a Sprint Planning
        </Link>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando historial...</p>}
        {isError && (
          <p className="text-sm text-destructive">No se pudo cargar el historial de este sprint.</p>
        )}
        {history && !history.available && (
          <p className="text-sm text-muted-foreground">{history.message}</p>
        )}
        {history && history.available && <SprintHistorySnapshotView snapshot={history.snapshot} />}
      </div>
    </AppShell>
  );
}

type SprintHistorySnapshotViewProps = {
  snapshot: SprintClosureSnapshot;
};

function SprintHistorySnapshotView({ snapshot }: SprintHistorySnapshotViewProps) {
  const columns = groupSnapshotTasksByColumn(snapshot.tasks);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold mb-1">{snapshot.sprintName}</h1>
        <p className="text-sm text-muted-foreground">{formatSnapshotDateRange(snapshot)}</p>
        {snapshot.goal && <p className="mt-1 text-sm text-muted-foreground">{snapshot.goal}</p>}
        <p className="mt-2 text-sm">
          {snapshot.completedPoints} / {snapshot.totalCommittedPoints} puntos completados
        </p>
      </div>
      {columns.length === 0 && (
        <p className="text-sm text-muted-foreground">Este sprint se cerró sin tareas asignadas.</p>
      )}
      {columns.length > 0 && (
        <div className="flex gap-4 overflow-x-auto">
          {columns.map((column) => (
            <SprintHistoryColumn key={column.columnId ?? "none"} column={column} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatSnapshotDateRange(snapshot: SprintClosureSnapshot): string {
  const startDate = new Date(snapshot.startDate).toLocaleDateString();
  const endDate = new Date(snapshot.endDate).toLocaleDateString();
  return `${startDate} - ${endDate}`;
}
