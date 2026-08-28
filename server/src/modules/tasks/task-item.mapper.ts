import type { Task } from "@prisma/client";
import type { BacklogTaskItem } from "@shared/schemas/task.schema";
import { findAssigneesByTaskId } from "./assignees/assignees.service";

// Shared by every read path that returns task summaries (the backlog listing,
// the sprint task listing, ...) so they don't each redefine the same mapping.
export async function mapTaskToBacklogItem(task: Task): Promise<BacklogTaskItem> {
  const assignees = await findAssigneesByTaskId(task.id);
  return {
    id: task.id,
    title: task.title,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    position: task.position,
    createdAt: task.createdAt,
    assignees,
  };
}
