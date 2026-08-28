import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { BacklogTask } from "./list-backlog.api";
import { PriorityBadge } from "./PriorityBadge";

type PlanningTaskRowProps = {
  task: BacklogTask;
  sourceColumn: "backlog" | "sprint";
  canDrag: boolean;
};

export function PlanningTaskRow({ task, sourceColumn, canDrag }: PlanningTaskRowProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { sourceColumn },
    disabled: !canDrag,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.5 : 1 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(canDrag ? attributes : {})}
      {...(canDrag ? listeners : {})}
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3",
        canDrag && "cursor-grab touch-none",
      )}
    >
      <span className="truncate text-sm font-medium">{task.title}</span>
      <div className="flex flex-none items-center gap-2">
        {task.estimatedPoints !== null && (
          <span className="text-xs text-muted-foreground">{task.estimatedPoints} pts</span>
        )}
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}
