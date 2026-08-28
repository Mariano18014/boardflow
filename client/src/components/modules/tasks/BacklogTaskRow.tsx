import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BacklogTask } from "./list-backlog.api";
import { PriorityBadge } from "./PriorityBadge";

type BacklogTaskRowProps = {
  task: BacklogTask;
  canDrag: boolean;
};

export function BacklogTaskRow({ task, canDrag }: BacklogTaskRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
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
      className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        {canDrag && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-text-3 hover:text-foreground"
            aria-label="Reordenar tarea"
          >
            ⠿
          </button>
        )}
        <span className="truncate text-sm font-medium">{task.title}</span>
      </div>
      <div className="flex flex-none items-center gap-2">
        {task.estimatedPoints !== null && (
          <span className="text-xs text-muted-foreground">{task.estimatedPoints} pts</span>
        )}
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}
