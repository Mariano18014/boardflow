import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTaskDetail } from "./use-task-detail";
import { useUpdateTaskDetails } from "./use-update-task-details";
import { buildEditableFieldsFromTask, buildTaskDetailChanges, type EditableTaskFields } from "./task-detail-changes.util";
import { TaskTitleField } from "./TaskTitleField";
import { TaskDescriptionField } from "./TaskDescriptionField";
import { TaskPriorityField } from "./TaskPriorityField";
import { TaskEstimatedPointsField } from "./TaskEstimatedPointsField";
import { TaskDueDateField } from "./TaskDueDateField";
import { TaskApiError } from "./task-api-error";

type TaskDetailPanelProps = {
  organizationId: string;
  projectId: string;
  taskId: string | null;
  canEditTasks: boolean;
  onClose: () => void;
};

export function TaskDetailPanel({ organizationId, projectId, taskId, canEditTasks, onClose }: TaskDetailPanelProps) {
  const { data: task, isLoading } = useTaskDetail(organizationId, projectId, taskId ?? undefined);
  const { updateTaskDetails, isPending } = useUpdateTaskDetails(organizationId, projectId, taskId ?? "");
  const { toast } = useToast();
  const [editedFields, setEditedFields] = useState<EditableTaskFields | null>(null);

  useEffect(() => {
    setEditedFields(task ? buildEditableFieldsFromTask(task) : null);
  }, [task]);

  function updateField<K extends keyof EditableTaskFields>(field: K, value: EditableTaskFields[K]) {
    setEditedFields((current) => (current ? { ...current, [field]: value } : current));
  }

  function handleSave() {
    if (!task || !editedFields) {
      return;
    }
    const changes = buildTaskDetailChanges(task, editedFields);
    updateTaskDetails(changes, {
      onSuccess: () => {
        toast({ title: "Tarea actualizada", description: `Se guardaron los cambios de "${task.title}".` });
        onClose();
      },
      onError: (error) => {
        const message = error instanceof TaskApiError ? error.message : "No se pudo guardar la tarea.";
        toast({ variant: "destructive", title: "No se pudo guardar", description: message });
      },
    });
  }

  return (
    <Dialog open={taskId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Detalle de la tarea</DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando tarea...</p>}

        {task && editedFields && (
          <>
            <div className="flex flex-col gap-4">
              <TaskTitleField
                value={editedFields.title}
                onChange={(value) => updateField("title", value)}
                isReadOnly={!canEditTasks}
              />
              <TaskDescriptionField
                value={editedFields.description}
                onChange={(value) => updateField("description", value)}
                isReadOnly={!canEditTasks}
              />
              <TaskPriorityField
                value={editedFields.priority}
                onChange={(value) => updateField("priority", value)}
                isReadOnly={!canEditTasks}
              />
              <TaskEstimatedPointsField
                value={editedFields.estimatedPoints}
                onChange={(value) => updateField("estimatedPoints", value)}
                isReadOnly={!canEditTasks}
              />
              <TaskDueDateField
                value={editedFields.dueDate}
                onChange={(value) => updateField("dueDate", value)}
                isReadOnly={!canEditTasks}
              />
            </div>
            {canEditTasks && (
              <DialogFooter>
                <Button onClick={handleSave} disabled={isPending}>
                  {isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
