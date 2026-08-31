import { Link } from "wouter";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Board } from "./list-boards.api";
import { resolveBoardNavigationTarget } from "./resolve-board-navigation-target";

type BoardCardProps = {
  board: Board;
  canDrag: boolean;
  activeSprintId: string | undefined;
  isLoadingActiveSprint: boolean;
};

export function BoardCard({ board, canDrag, activeSprintId, isLoadingActiveSprint }: BoardCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: board.id,
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
      className="flex items-center gap-3 rounded-md border border-border bg-surface p-4"
    >
      {canDrag && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-text-3 hover:text-foreground"
          aria-label="Reordenar tablero"
        >
          ⠿
        </button>
      )}
      <BoardCardLabel
        board={board}
        activeSprintId={activeSprintId}
        isLoadingActiveSprint={isLoadingActiveSprint}
      />
    </div>
  );
}

type BoardCardLabelProps = {
  board: Board;
  activeSprintId: string | undefined;
  isLoadingActiveSprint: boolean;
};

function BoardCardLabel({ board, activeSprintId, isLoadingActiveSprint }: BoardCardLabelProps) {
  const navigationTarget = resolveBoardNavigationTarget(board.projectId, activeSprintId);

  if (navigationTarget) {
    return (
      <Link href={navigationTarget} className="flex-1 truncate font-heading text-sm font-semibold">
        {board.name}
      </Link>
    );
  }

  if (isLoadingActiveSprint) {
    return (
      <span className="flex-1 truncate font-heading text-sm font-semibold text-muted-foreground">
        {board.name}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex-1 truncate font-heading text-sm font-semibold text-muted-foreground cursor-default">
          {board.name}
        </span>
      </TooltipTrigger>
      <TooltipContent>No hay un sprint activo — andá a Sprint Planning para iniciar uno.</TooltipContent>
    </Tooltip>
  );
}
