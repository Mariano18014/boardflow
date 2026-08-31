import { useEffect, useState } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useToast } from "@/hooks/use-toast";
import type { BacklogTask } from "./list-backlog.api";
import { BacklogColumn } from "./BacklogColumn";
import { SprintColumn } from "./SprintColumn";
import { useAssignTaskToSprint } from "./use-assign-task-to-sprint";

type PlanningColumn = "backlog" | "sprint";

type SprintPlanningBoardProps = {
  organizationId: string;
  projectId: string;
  sprintId: string;
  backlogTasks: BacklogTask[];
  sprintTasks: BacklogTask[];
  canEditTasks: boolean;
};

export function SprintPlanningBoard({
  organizationId,
  projectId,
  sprintId,
  backlogTasks,
  sprintTasks,
  canEditTasks,
}: SprintPlanningBoardProps) {
  const [orderedBacklogTasks, setOrderedBacklogTasks] = useState(backlogTasks);
  const [orderedSprintTasks, setOrderedSprintTasks] = useState(sprintTasks);
  const { assignTaskToSprint } = useAssignTaskToSprint(organizationId, projectId, sprintId);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setOrderedBacklogTasks(backlogTasks);
  }, [backlogTasks]);

  useEffect(() => {
    setOrderedSprintTasks(sprintTasks);
  }, [sprintTasks]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const sourceColumn = active.data.current?.sourceColumn as PlanningColumn | undefined;
    const targetColumn = over.id as PlanningColumn;
    if (!sourceColumn || sourceColumn === targetColumn) {
      return;
    }
    const taskId = active.id as string;
    if (targetColumn === "sprint") {
      moveTaskToSprint(taskId);
    } else {
      moveTaskToBacklog(taskId);
    }
  }

  function moveTaskToSprint(taskId: string) {
    const task = orderedBacklogTasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    const previousBacklog = orderedBacklogTasks;
    const previousSprint = orderedSprintTasks;
    applyOptimisticMove(
      orderedBacklogTasks.filter((item) => item.id !== taskId),
      [...orderedSprintTasks, task],
    );
    persistAssignment(taskId, sprintId, previousBacklog, previousSprint);
  }

  function moveTaskToBacklog(taskId: string) {
    const task = orderedSprintTasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    const previousBacklog = orderedBacklogTasks;
    const previousSprint = orderedSprintTasks;
    applyOptimisticMove(
      [...orderedBacklogTasks, task],
      orderedSprintTasks.filter((item) => item.id !== taskId),
    );
    persistAssignment(taskId, null, previousBacklog, previousSprint);
  }

  function applyOptimisticMove(newBacklog: BacklogTask[], newSprint: BacklogTask[]) {
    setOrderedBacklogTasks(newBacklog);
    setOrderedSprintTasks(newSprint);
  }

  function persistAssignment(
    taskId: string,
    targetSprintId: string | null,
    previousBacklog: BacklogTask[],
    previousSprint: BacklogTask[],
  ) {
    assignTaskToSprint(
      { taskId, sprintId: targetSprintId },
      {
        onError: () => {
          applyOptimisticMove(previousBacklog, previousSprint);
          toast({
            variant: "destructive",
            title: "No se pudo mover la tarea",
            description: "Se restauró el estado anterior. Probá de nuevo.",
          });
        },
      },
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-3">Backlog</h2>
          <BacklogColumn tasks={orderedBacklogTasks} canDrag={canEditTasks} />
        </div>
        <div>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-3">Sprint</h2>
          <SprintColumn tasks={orderedSprintTasks} canDrag={canEditTasks} />
        </div>
      </div>
    </DndContext>
  );
}
