import type { Task } from "@prisma/client";
import type { BacklogTaskItem } from "@shared/schemas/task.schema";

// Shared by every read path that returns task summaries (the backlog listing,
// the sprint task listing, ...) so they don't each redefine the same mapping.
export function mapTaskToBacklogItem(task: Task): BacklogTaskItem {
  return {
    id: task.id,
    title: task.title,
    priority: task.priority,
    estimatedPoints: task.estimatedPoints,
    position: task.position,
    createdAt: task.createdAt,
    assignees: [],
  };
}
