import { Link } from "wouter";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Board } from "./list-boards.api";

type BoardCardProps = {
  board: Board;
  canDrag: boolean;
};

export function BoardCard({ board, canDrag }: BoardCardProps) {
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
      <Link href={`/boards/${board.id}`} className="flex-1 truncate font-heading text-sm font-semibold">
        {board.name}
      </Link>
    </div>
  );
}
