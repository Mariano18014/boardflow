import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useToast } from "@/hooks/use-toast";
import { useDragToReorder } from "@/hooks/use-drag-to-reorder";
import type { Board } from "./list-boards.api";
import { BoardCard } from "./BoardCard";
import { useReorderBoards } from "./use-reorder-boards";

type BoardsListProps = {
  boards: Board[];
  organizationId: string;
  projectId: string;
  canEditBoards: boolean;
};

export function BoardsList({ boards, organizationId, projectId, canEditBoards }: BoardsListProps) {
  const { reorderBoards } = useReorderBoards(organizationId, projectId);
  const { toast } = useToast();
  const { orderedItems, sensors, handleDragEnd, applyOptimisticOrder } = useDragToReorder({
    items: boards,
    getItemId: (board) => board.id,
    onReorder: persistBoardOrder,
  });

  function persistBoardOrder(boardIds: string[], previousOrder: Board[]) {
    reorderBoards(boardIds, {
      onError: () => {
        applyOptimisticOrder(previousOrder);
        toast({
          variant: "destructive",
          title: "No se pudo reordenar los tableros",
          description: "Se restauró el orden anterior. Probá de nuevo.",
        });
      },
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedItems.map((board) => board.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {orderedItems.map((board) => (
            <BoardCard key={board.id} board={board} canDrag={canEditBoards} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
