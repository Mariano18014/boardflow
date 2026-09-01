import type { Task } from "@prisma/client";
import { getRealtimeServer } from "./realtime-server";
import { buildBacklogRoomName, buildSprintBoardRoomName } from "./realtime-rooms.util";
import { findSprintById } from "../sprints/sprints.service";
import { findActiveSprintByProjectId } from "../sprints/sprints.repository";

const BACKLOG_CHANGED_EVENT = "backlog:changed";
const BOARD_CHANGED_EVENT = "board:changed";

export function notifyBacklogChanged(projectId: string): void {
  getRealtimeServer().to(buildBacklogRoomName(projectId)).emit(BACKLOG_CHANGED_EVENT);
}

export function notifySprintBoardChanged(sprintId: string): void {
  getRealtimeServer().to(buildSprintBoardRoomName(sprintId)).emit(BOARD_CHANGED_EVENT);
}

export async function notifyTaskContextChanged(task: Task): Promise<void> {
  if (task.sprintId === null) {
    notifyBacklogChanged(task.projectId);
    return;
  }
  const sprint = await findSprintById(task.sprintId, task.projectId);
  if (isSprintActive(sprint.status)) {
    notifySprintBoardChanged(task.sprintId);
  }
}

export async function notifySprintBoardChangedForProject(projectId: string): Promise<void> {
  const activeSprint = await findActiveSprintByProjectId(projectId);
  if (activeSprint === null) {
    return;
  }
  notifySprintBoardChanged(activeSprint.id);
}

function isSprintActive(status: string): boolean {
  return status === "ACTIVE";
}
