import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "./PriorityBadge";
import type { SprintBoardTask } from "./get-sprint-board.api";

type SprintBoardTaskCardProps = {
  task: SprintBoardTask;
  columnId: string;
  canDrag: boolean;
};

export function SprintBoardTaskCard({ task, columnId, canDrag }: SprintBoardTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { columnId },
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(canDrag ? attributes : {})}
      {...(canDrag ? listeners : {})}
      className={cn(
        "rounded-md border border-border bg-surface px-4 py-3",
        canDrag && "cursor-grab touch-none",
      )}
    >
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
