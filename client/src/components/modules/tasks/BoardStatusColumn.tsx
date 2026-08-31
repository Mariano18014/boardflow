import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { WipLimitEditor } from "@/components/modules/boards/WipLimitEditor";
import type { SprintBoardColumn } from "./get-sprint-board.api";
import { SprintBoardTaskCard } from "./SprintBoardTaskCard";
import { describeColumnTaskCount } from "./describe-column-task-count.util";

type BoardStatusColumnProps = {
  organizationId: string;
  projectId: string;
  sprintId: string;
  column: SprintBoardColumn;
  canDrag: boolean;
  canEditBoards: boolean;
  onOpenDetail: (taskId: string) => void;
};

export function BoardStatusColumn({
  organizationId,
  projectId,
  sprintId,
  column,
  canDrag,
  canEditBoards,
  onOpenDetail,
}: BoardStatusColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const taskIds = column.tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className="flex w-72 flex-none flex-col gap-3 rounded-md border border-border bg-muted/30 p-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-3">{column.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            {describeColumnTaskCount(column.tasks.length, column.wipLimit)}
          </span>
          {canEditBoards && (
            <WipLimitEditor
              organizationId={organizationId}
              projectId={projectId}
              sprintId={sprintId}
              columnId={column.id}
              wipLimit={column.wipLimit}
            />
          )}
        </div>
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
