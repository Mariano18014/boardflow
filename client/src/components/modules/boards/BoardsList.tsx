import { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useToast } from "@/hooks/use-toast";
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
  const [orderedBoards, setOrderedBoards] = useState(boards);
  const { reorderBoards } = useReorderBoards(organizationId, projectId);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setOrderedBoards(boards);
  }, [boards]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = orderedBoards.findIndex((board) => board.id === active.id);
    const newIndex = orderedBoards.findIndex((board) => board.id === over.id);
    const previousOrder = orderedBoards;
    const newOrder = arrayMove(orderedBoards, oldIndex, newIndex);
    applyOptimisticOrder(newOrder);
    persistBoardOrder(newOrder, previousOrder);
  }

  function applyOptimisticOrder(newOrder: Board[]) {
    setOrderedBoards(newOrder);
  }

  function persistBoardOrder(newOrder: Board[], previousOrder: Board[]) {
    const boardIds = newOrder.map((board) => board.id);
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
      <SortableContext
        items={orderedBoards.map((board) => board.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {orderedBoards.map((board) => (
            <BoardCard key={board.id} board={board} canDrag={canEditBoards} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
