import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOrganizationMembers } from "@/components/modules/members/use-organization-members";
import { useLabels } from "@/components/modules/labels/use-labels";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { useTaskDetail } from "./use-task-detail";
import { useUpdateTaskDetails } from "./use-update-task-details";
import { useReplaceTaskAssignees } from "./use-replace-task-assignees";
import { useReplaceTaskLabels } from "./use-replace-task-labels";
import { useComments } from "./use-comments";
import { buildEditableFieldsFromTask, buildTaskDetailChanges, type EditableTaskFields } from "./task-detail-changes.util";
import { TaskTitleField } from "./TaskTitleField";
import { TaskDescriptionField } from "./TaskDescriptionField";
import { TaskPriorityField } from "./TaskPriorityField";
import { TaskEstimatedPointsField } from "./TaskEstimatedPointsField";
import { TaskDueDateField } from "./TaskDueDateField";
import { AssigneeSelect } from "./AssigneeSelect";
import { LabelSelect } from "./LabelSelect";
import { CommentsList } from "./CommentsList";
import { AddCommentForm } from "./AddCommentForm";
import { TaskApiError } from "./task-api-error";
import type { TaskDetail } from "./get-task-detail.api";

type TaskDetailPanelProps = {
  organizationId: string;
  projectId: string;
  taskId: string | null;
  canEditTasks: boolean;
  onClose: () => void;
};

export function TaskDetailPanel({ organizationId, projectId, taskId, canEditTasks, onClose }: TaskDetailPanelProps) {
  const { data: task, isLoading } = useTaskDetail(organizationId, projectId, taskId ?? undefined);
  const { data: members } = useOrganizationMembers(organizationId);
  const { data: projectLabels } = useLabels(organizationId, projectId);
  const { hasPermission } = useHasPermission(organizationId);
  const canViewComments = hasPermission("comments:view");
  const canCreateComments = hasPermission("comments:create");
  const { data: comments } = useComments(organizationId, projectId, taskId ?? undefined, canViewComments);
  const { updateTaskDetailsAsync, isPending } = useUpdateTaskDetails(organizationId, projectId, taskId ?? "");
  const { replaceTaskAssigneesAsync, isReplacingAssignees } = useReplaceTaskAssignees(
    organizationId,
    projectId,
    taskId ?? "",
    task?.sprintId ?? null,
  );
  const { replaceTaskLabelsAsync, isReplacingLabels } = useReplaceTaskLabels(
    organizationId,
    projectId,
    taskId ?? "",
    task?.sprintId ?? null,
  );
  const { toast } = useToast();
  const [editedFields, setEditedFields] = useState<EditableTaskFields | null>(null);
  const [selectedAssigneeUserIds, setSelectedAssigneeUserIds] = useState<string[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);

  useEffect(() => {
    setEditedFields(task ? buildEditableFieldsFromTask(task) : null);
    setSelectedAssigneeUserIds(task ? task.assignees.map((assignee) => assignee.id) : []);
    setSelectedLabelIds(task ? task.labels.map((label) => label.id) : []);
  }, [task]);

  function updateField<K extends keyof EditableTaskFields>(field: K, value: EditableTaskFields[K]) {
    setEditedFields((current) => (current ? { ...current, [field]: value } : current));
  }

  async function handleSave() {
    if (!task || !editedFields) {
      return;
    }
    try {
      await saveDetailChangesIfAny(task, editedFields);
      await saveAssigneesIfChanged(task, selectedAssigneeUserIds);
      await saveLabelsIfChanged(task, selectedLabelIds);
      toast({ title: "Tarea actualizada", description: `Se guardaron los cambios de "${task.title}".` });
      onClose();
    } catch (error) {
      const message = error instanceof TaskApiError ? error.message : "No se pudo guardar la tarea.";
      toast({ variant: "destructive", title: "No se pudo guardar", description: message });
    }
  }

  async function saveDetailChangesIfAny(currentTask: TaskDetail, edited: EditableTaskFields) {
    const changes = buildTaskDetailChanges(currentTask, edited);
    if (Object.keys(changes).length === 0) {
      return;
    }
    await updateTaskDetailsAsync(changes);
  }

  async function saveAssigneesIfChanged(currentTask: TaskDetail, editedUserIds: string[]) {
    const originalUserIds = currentTask.assignees.map((assignee) => assignee.id);
    if (!haveAssigneeSetsChanged(originalUserIds, editedUserIds)) {
      return;
    }
    await replaceTaskAssigneesAsync(editedUserIds);
  }

  async function saveLabelsIfChanged(currentTask: TaskDetail, editedLabelIds: string[]) {
    const originalLabelIds = currentTask.labels.map((label) => label.id);
    if (!haveLabelSetsChanged(originalLabelIds, editedLabelIds)) {
      return;
    }
    await replaceTaskLabelsAsync(editedLabelIds);
  }

  const isSaving = isPending || isReplacingAssignees || isReplacingLabels;

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
              <AssigneeSelect
                members={members ?? []}
                selectedUserIds={selectedAssigneeUserIds}
                onChange={setSelectedAssigneeUserIds}
                isReadOnly={!canEditTasks}
              />
              <LabelSelect
                labels={projectLabels ?? []}
                selectedLabelIds={selectedLabelIds}
                onChange={setSelectedLabelIds}
                isReadOnly={!canEditTasks}
              />
            </div>
            {canEditTasks && (
              <DialogFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            )}

            {canViewComments && (
              <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-text-3">
                  Comentarios
                </h3>
                <CommentsList
                  organizationId={organizationId}
                  projectId={projectId}
                  taskId={task.id}
                  comments={comments ?? []}
                />
                {/* Publishing a comment is independent and immediate — it has
                    its own mutation and button, unlike the rest of this panel
                    which only saves on "Guardar cambios". */}
                {canCreateComments && (
                  <AddCommentForm organizationId={organizationId} projectId={projectId} taskId={task.id} />
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function haveAssigneeSetsChanged(original: string[], edited: string[]): boolean {
  if (original.length !== edited.length) {
    return true;
  }
  const originalUserIds = new Set(original);
  return edited.some((userId) => !originalUserIds.has(userId));
}

function haveLabelSetsChanged(original: string[], edited: string[]): boolean {
  if (original.length !== edited.length) {
    return true;
  }
  const originalLabelIds = new Set(original);
  return edited.some((labelId) => !originalLabelIds.has(labelId));
}
