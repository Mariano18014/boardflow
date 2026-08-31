import type { SnapshotColumnGroup } from "./group-snapshot-tasks-by-column.util";
import { SprintHistoryTaskCard } from "./SprintHistoryTaskCard";

type SprintHistoryColumnProps = {
  column: SnapshotColumnGroup;
};

export function SprintHistoryColumn({ column }: SprintHistoryColumnProps) {
  return (
    <div className="flex w-72 flex-none flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-3">{column.columnName}</h3>
        <span className="text-xs text-muted-foreground">{column.tasks.length} tareas</span>
      </div>
      <div className="flex min-h-8 flex-col gap-2">
        {column.tasks.map((task) => (
          <SprintHistoryTaskCard key={task.taskId} task={task} />
        ))}
      </div>
    </div>
  );
}
