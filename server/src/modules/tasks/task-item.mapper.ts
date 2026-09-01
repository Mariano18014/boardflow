import type { Task } from "@prisma/client";
import type { BacklogTaskItem } from "@shared/schemas/task.schema";
import { findAssigneesByTaskId } from "./assignees/assignees.service";
import { findLabelsByTaskId } from "./labels/labels.service";

export async function mapTaskToBacklogItem(task: Task): Promise<BacklogTaskItem> {
  const assignees = await findAssigneesByTaskId(task.id);
  const labels = await findLabelsByTaskId(task.id);
  return {
    id: task.id,
    title: task.title,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    position: task.position,
    createdAt: task.createdAt,
    assignees,
    labels,
  };
}
