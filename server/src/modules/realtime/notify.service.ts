import type { Task } from "@prisma/client";
import { getRealtimeServer } from "./realtime-server";
import { buildBacklogRoomName, buildSprintBoardRoomName } from "./realtime-rooms.util";
import { findSprintById } from "../sprints/sprints.service";
import { findActiveSprintByProjectId } from "../sprints/sprints.repository";

const BACKLOG_CHANGED_EVENT = "backlog:changed";
const BOARD_CHANGED_EVENT = "board:changed";

// The payload is deliberately empty: clients that receive this just refetch
// the same GET they already use (getProjectBacklog), instead of the server
// having to keep every client in sync with a granular diff per mutation type.
export function notifyBacklogChanged(projectId: string): void {
  getRealtimeServer().to(buildBacklogRoomName(projectId)).emit(BACKLOG_CHANGED_EVENT);
}

export function notifySprintBoardChanged(sprintId: string): void {
  getRealtimeServer().to(buildSprintBoardRoomName(sprintId)).emit(BOARD_CHANGED_EVENT);
}

// Shared by every task mutation that can affect either the backlog or a
// sprint board depending on the task's current state, so each of those
// mutations doesn't have to repeat this same "backlog or board?" decision.
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

// Used when a change belongs to a column (e.g. its WIP limit) rather than to
// a specific task or sprint, so the caller only has a projectId to work with.
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
