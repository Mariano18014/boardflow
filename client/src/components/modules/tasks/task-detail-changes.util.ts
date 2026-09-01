import type { TaskDetail } from "./get-task-detail.api";
import type { UpdateTaskDetailsBody } from "./update-task-details.api";

export type EditableTaskFields = {
  title: string;
  description: string;
  priority: TaskDetail["priority"];
  estimatedPoints: number | null;
  dueDate: Date | undefined;
};

export function buildEditableFieldsFromTask(task: TaskDetail): EditableTaskFields {
  return {
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  };
}

export function buildTaskDetailChanges(original: TaskDetail, edited: EditableTaskFields): UpdateTaskDetailsBody {
  const changes: UpdateTaskDetailsBody = {};
  if (edited.title !== original.title) {
    changes.title = edited.title;
  }
  if (edited.description !== (original.description ?? "")) {
    changes.description = edited.description;
  }
  if (edited.priority !== original.priority) {
    changes.priority = edited.priority;
  }
  if (edited.estimatedPoints !== null && edited.estimatedPoints !== original.estimatedPoints) {
    changes.estimatedPoints = edited.estimatedPoints;
  }
  const originalDueDate = original.dueDate ? new Date(original.dueDate).getTime() : undefined;
  const editedDueDate = edited.dueDate ? edited.dueDate.getTime() : undefined;
  if (editedDueDate !== undefined && editedDueDate !== originalDueDate) {
    changes.dueDate = edited.dueDate!.toISOString();
  }
  return changes;
}
