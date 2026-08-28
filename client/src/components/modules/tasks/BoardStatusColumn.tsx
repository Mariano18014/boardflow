import type { SprintBoardColumn } from "./get-sprint-board.api";
import { SprintBoardTaskCard } from "./SprintBoardTaskCard";

type BoardStatusColumnProps = {
  column: SprintBoardColumn;
};

export function BoardStatusColumn({ column }: BoardStatusColumnProps) {
  return (
    <div className="flex w-72 flex-none flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-3">{column.name}</h3>
        <span className="text-xs text-muted-foreground">{column.tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {column.tasks.map((task) => (
          <SprintBoardTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
