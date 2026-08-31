import { PriorityBadge } from "@/components/modules/tasks/PriorityBadge";
import type { SprintHistoryTask } from "./get-sprint-history.api";

type SprintHistoryTaskCardProps = {
  task: SprintHistoryTask;
};

// Read-only by design: this renders a frozen snapshot taken at close time, not
// the live task, so there's nothing here to drag, click, or edit.
export function SprintHistoryTaskCard({ task }: SprintHistoryTaskCardProps) {
  return (
    <div className="rounded-md border border-border bg-surface px-4 py-3">
      <p className="mb-2 text-sm font-medium">{task.title}</p>
      <div className="flex items-center gap-2">
        {task.estimatedPoints !== null && (
          <span className="text-xs text-muted-foreground">{task.estimatedPoints} pts</span>
        )}
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}
