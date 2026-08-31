import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { BacklogTask } from "./list-backlog.api";
import { PlanningTaskRow } from "./PlanningTaskRow";

type BacklogColumnProps = {
  tasks: BacklogTask[];
  canDrag: boolean;
};

export function BacklogColumn({ tasks, canDrag }: BacklogColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "backlog" });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[200px] flex-col gap-2 rounded-md border border-border p-3",
        isOver && "border-accent bg-accent-subtle",
      )}
    >
      {tasks.length === 0 && (
        <p className="text-sm text-muted-foreground">No hay tareas en el backlog.</p>
      )}
      {tasks.map((task) => (
        <PlanningTaskRow key={task.id} task={task} sourceColumn="backlog" canDrag={canDrag} />
      ))}
    </div>
  );
}
