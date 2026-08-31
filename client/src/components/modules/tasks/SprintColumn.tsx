import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { BacklogTask } from "./list-backlog.api";
import { PlanningTaskRow } from "./PlanningTaskRow";

type SprintColumnProps = {
  tasks: BacklogTask[];
  canDrag: boolean;
};

export function SprintColumn({ tasks, canDrag }: SprintColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "sprint" });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[200px] flex-col gap-2 rounded-md border border-border p-3",
        isOver && "border-accent bg-accent-subtle",
      )}
    >
      {tasks.length === 0 && (
        <p className="text-sm text-muted-foreground">Todavía no hay tareas asignadas a este sprint.</p>
      )}
      {tasks.map((task) => (
        <PlanningTaskRow key={task.id} task={task} sourceColumn="sprint" canDrag={canDrag} />
      ))}
    </div>
  );
}
