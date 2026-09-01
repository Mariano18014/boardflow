// A user's socket joins one room per screen it has open. Naming both rooms
// with their entity id keeps the scoping obvious: a socket only ever
// receives events for the exact project/sprint room it joined.

const BACKLOG_ROOM_PREFIX = "backlog:";
const SPRINT_BOARD_ROOM_PREFIX = "sprint-board:";

export function buildBacklogRoomName(projectId: string): string {
  return `${BACKLOG_ROOM_PREFIX}${projectId}`;
}

export function buildSprintBoardRoomName(sprintId: string): string {
  return `${SPRINT_BOARD_ROOM_PREFIX}${sprintId}`;
}

// Used on socket disconnect (HU-41): at that point we only have the list of
// room names the socket was in, and need to find which of those were
// sprint-board rooms so presence can be cleaned up for each.
export function extractSprintIdFromRoomName(roomName: string): string | null {
  if (!roomName.startsWith(SPRINT_BOARD_ROOM_PREFIX)) {
    return null;
  }
  return roomName.slice(SPRINT_BOARD_ROOM_PREFIX.length);
}
