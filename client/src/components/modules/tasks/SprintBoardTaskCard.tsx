import { PriorityBadge } from "./PriorityBadge";
import type { SprintBoardTask } from "./get-sprint-board.api";

type SprintBoardTaskCardProps = {
  task: SprintBoardTask;
};

export function SprintBoardTaskCard({ task }: SprintBoardTaskCardProps) {
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
