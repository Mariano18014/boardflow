

const BACKLOG_ROOM_PREFIX = "backlog:";
const SPRINT_BOARD_ROOM_PREFIX = "sprint-board:";

export function buildBacklogRoomName(projectId: string): string {
  return `${BACKLOG_ROOM_PREFIX}${projectId}`;
}

export function buildSprintBoardRoomName(sprintId: string): string {
  return `${SPRINT_BOARD_ROOM_PREFIX}${sprintId}`;
}

export function extractSprintIdFromRoomName(roomName: string): string | null {
  if (!roomName.startsWith(SPRINT_BOARD_ROOM_PREFIX)) {
    return null;
  }
  return roomName.slice(SPRINT_BOARD_ROOM_PREFIX.length);
}
