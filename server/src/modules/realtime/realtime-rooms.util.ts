// A user's socket joins one room per screen it has open. Naming both rooms
// with their entity id keeps the scoping obvious: a socket only ever
// receives events for the exact project/sprint room it joined.

export function buildBacklogRoomName(projectId: string): string {
  return `backlog:${projectId}`;
}

export function buildSprintBoardRoomName(sprintId: string): string {
  return `sprint-board:${sprintId}`;
}
