import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { SprintBoardColumn } from "./get-sprint-board.api";
import { SprintBoardTaskCard } from "./SprintBoardTaskCard";

type BoardStatusColumnProps = {
  column: SprintBoardColumn;
  canDrag: boolean;
  onOpenDetail: (taskId: string) => void;
};

export function BoardStatusColumn({ column, canDrag, onOpenDetail }: BoardStatusColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const taskIds = column.tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className="flex w-72 flex-none flex-col gap-3 rounded-md border border-border bg-muted/30 p-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-3">{column.name}</h3>
        <span className="text-xs text-muted-foreground">{column.tasks.length}</span>
      </div>
      <div className="flex min-h-8 flex-col gap-2">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <SprintBoardTaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              canDrag={canDrag}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
