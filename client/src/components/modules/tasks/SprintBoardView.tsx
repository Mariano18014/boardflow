import { useEffect, useState } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useToast } from "@/hooks/use-toast";
import { CloseSprintButton } from "@/components/modules/sprints/CloseSprintButton";
import type { SprintSummary } from "@/components/modules/sprints/list-sprints.api";
import type { SprintBoard, SprintBoardColumn } from "./get-sprint-board.api";
import { BoardStatusColumn } from "./BoardStatusColumn";
import { useMoveTaskToColumn } from "./use-move-task-to-column";
import { moveTaskAcrossColumns, resolveDropTarget, type TaskMove } from "./board-columns.util";
import { countUnfinishedTasks } from "./count-unfinished-tasks.util";
import { TaskApiError } from "./task-api-error";

type SprintBoardViewProps = {
  organizationId: string;
  projectId: string;
  sprintId: string;
  board: SprintBoard;
  canEditTasks: boolean;
  canEditSprints: boolean;
  canEditBoards: boolean;
  onOpenTaskDetail: (taskId: string) => void;
  onSprintClosed: (sprint: SprintSummary) => void;
};

export function SprintBoardView({
  organizationId,
  projectId,
  sprintId,
  board,
  canEditTasks,
  canEditSprints,
  canEditBoards,
  onOpenTaskDetail,
  onSprintClosed,
}: SprintBoardViewProps) {
  const [columns, setColumns] = useState(board.columns);
  const { moveTaskToColumn } = useMoveTaskToColumn(organizationId, projectId, sprintId);
  const { toast } = useToast();
  // Same reasoning as use-drag-to-reorder.ts: a small activation distance lets
  // a plain click (opening a task's detail panel) pass through untouched.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    setColumns(board.columns);
  }, [board.columns]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const sourceColumnId = active.data.current?.columnId as string | undefined;
    if (!sourceColumnId) {
      return;
    }
    const dropTarget = resolveDropTarget(over, columns);
    if (!dropTarget) {
      return;
    }
    const move: TaskMove = {
      taskId: active.id as string,
      sourceColumnId,
      destinationColumnId: dropTarget.columnId,
      destinationIndex: dropTarget.index,
    };
    if (move.sourceColumnId === move.destinationColumnId && active.id === over.id) {
      return;
    }
    applyMove(move);
  }

  function applyMove(move: TaskMove) {
    const previousColumns = columns;
    const newColumns = moveTaskAcrossColumns(columns, move);
    applyOptimisticColumns(newColumns);
    persistMove(move, previousColumns);
  }

  function applyOptimisticColumns(newColumns: SprintBoardColumn[]) {
    setColumns(newColumns);
  }

  function persistMove(move: TaskMove, previousColumns: SprintBoardColumn[]) {
    moveTaskToColumn(
      { taskId: move.taskId, columnId: move.destinationColumnId, position: move.destinationIndex },
      {
        onError: (error) => {
          applyOptimisticColumns(previousColumns);
          toast({
            variant: "destructive",
            title: "No se pudo mover la tarea",
            description: error instanceof TaskApiError ? error.message : "Se restauró el estado anterior. Probá de nuevo.",
          });
        },
      },
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-bold mb-1">{board.sprint.name}</h1>
          <p className="text-sm text-muted-foreground">{formatSprintDateRange(board.sprint)}</p>
          {board.sprint.goal && <p className="mt-1 text-sm text-muted-foreground">{board.sprint.goal}</p>}
        </div>
        <CloseSprintButton
          organizationId={organizationId}
          projectId={projectId}
          sprintId={sprintId}
          canEditSprints={canEditSprints}
          unfinishedTaskCount={countUnfinishedTasks(columns)}
          onSprintClosed={onSprintClosed}
        />
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {columns.map((column) => (
            <BoardStatusColumn
              key={column.id}
              organizationId={organizationId}
              projectId={projectId}
              sprintId={sprintId}
              column={column}
              canDrag={canEditTasks}
              canEditBoards={canEditBoards}
              onOpenDetail={onOpenTaskDetail}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function formatSprintDateRange(sprint: SprintBoard["sprint"]): string {
  const startDate = new Date(sprint.startDate).toLocaleDateString();
  const endDate = new Date(sprint.endDate).toLocaleDateString();
  return `${startDate} - ${endDate}`;
}
