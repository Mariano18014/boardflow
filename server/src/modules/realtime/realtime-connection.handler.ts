import { buildBacklogRoomName, buildSprintBoardRoomName, extractSprintIdFromRoomName } from "./realtime-rooms.util";
import { checkRequesterCanJoinBacklogRoom, checkRequesterCanJoinSprintBoardRoom } from "./join-room.service";
import { handleSprintBoardJoin, handleSprintBoardLeaveOrDisconnect } from "./presence.handler";
import type { AuthenticatedSocket } from "./realtime.types";

type JoinBacklogPayload = { projectId: string };
type JoinSprintBoardPayload = { sprintId: string };

export function registerConnectionHandlers(socket: AuthenticatedSocket) {
  socket.on("join:backlog", (payload: JoinBacklogPayload) => joinBacklogRoom(socket, payload));
  socket.on("leave:backlog", (payload: JoinBacklogPayload) => leaveBacklogRoom(socket, payload));
  socket.on("join:sprint-board", (payload: JoinSprintBoardPayload) => joinSprintBoardRoom(socket, payload));
  socket.on("leave:sprint-board", (payload: JoinSprintBoardPayload) => leaveSprintBoardRoom(socket, payload));
  socket.on("disconnecting", () => cleanUpPresenceForAllRoomsOnDisconnect(socket));
}

async function joinBacklogRoom(socket: AuthenticatedSocket, payload: JoinBacklogPayload) {
  try {
    await checkRequesterCanJoinBacklogRoom(payload.projectId, getRequesterId(socket));
    await socket.join(buildBacklogRoomName(payload.projectId));
  } catch {
    // The requester isn't allowed to see this project's backlog — the socket
    // simply never joins the room, so it never receives its events.
  }
}

function leaveBacklogRoom(socket: AuthenticatedSocket, payload: JoinBacklogPayload) {
  socket.leave(buildBacklogRoomName(payload.projectId));
}

async function joinSprintBoardRoom(socket: AuthenticatedSocket, payload: JoinSprintBoardPayload) {
  try {
    await checkRequesterCanJoinSprintBoardRoom(payload.sprintId, getRequesterId(socket));
    await socket.join(buildSprintBoardRoomName(payload.sprintId));
    handleSprintBoardJoin(socket, payload.sprintId);
  } catch {
    // Same reasoning as joinBacklogRoom: fail closed, no room join, no
    // presence entry either.
  }
}

function leaveSprintBoardRoom(socket: AuthenticatedSocket, payload: JoinSprintBoardPayload) {
  socket.leave(buildSprintBoardRoomName(payload.sprintId));
  handleSprintBoardLeaveOrDisconnect(socket, payload.sprintId);
}

// "disconnecting" (not "disconnect") fires while socket.rooms still lists the
// rooms the socket was in — covers a closed tab or dropped connection, which
// never emits an explicit leave:sprint-board.
function cleanUpPresenceForAllRoomsOnDisconnect(socket: AuthenticatedSocket) {
  const roomNames = Array.from(socket.rooms);
  for (const roomName of roomNames) {
    const sprintId = extractSprintIdFromRoomName(roomName);
    if (sprintId !== null) {
      handleSprintBoardLeaveOrDisconnect(socket, sprintId);
    }
  }
}

function getRequesterId(socket: AuthenticatedSocket): string {
  return socket.data.userId;
}
