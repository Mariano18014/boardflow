import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useToast } from "@/hooks/use-toast";
import { useDragToReorder } from "@/hooks/use-drag-to-reorder";
import type { BacklogTask } from "./list-backlog.api";
import { BacklogTaskRow } from "./BacklogTaskRow";
import { useReorderBacklog } from "./use-reorder-backlog";

type BacklogListProps = {
  tasks: BacklogTask[];
  organizationId: string;
  projectId: string;
  canEditTasks: boolean;
  onOpenDetail: (taskId: string) => void;
};

export function BacklogList({ tasks, organizationId, projectId, canEditTasks, onOpenDetail }: BacklogListProps) {
  const { reorderBacklogTasks } = useReorderBacklog(organizationId, projectId);
  const { toast } = useToast();
  const { orderedItems, sensors, handleDragEnd, applyOptimisticOrder } = useDragToReorder({
    items: tasks,
    getItemId: (task) => task.id,
    onReorder: persistBacklogOrder,
  });

  function persistBacklogOrder(taskIds: string[], previousOrder: BacklogTask[]) {
    reorderBacklogTasks(taskIds, {
      onError: () => {
        applyOptimisticOrder(previousOrder);
        toast({
          variant: "destructive",
          title: "No se pudo reordenar el backlog",
          description: "Se restauró el orden anterior. Probá de nuevo.",
        });
      },
    });
  }

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay tareas en el backlog. Cuando puedas crear tareas, van a aparecer acá.
      </p>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedItems.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {orderedItems.map((task) => (
            <BacklogTaskRow key={task.id} task={task} canDrag={canEditTasks} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
