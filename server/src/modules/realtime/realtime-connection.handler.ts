import type { Socket } from "socket.io";
import { buildBacklogRoomName, buildSprintBoardRoomName } from "./realtime-rooms.util";
import { checkRequesterCanJoinBacklogRoom, checkRequesterCanJoinSprintBoardRoom } from "./join-room.service";

type JoinBacklogPayload = { projectId: string };
type JoinSprintBoardPayload = { sprintId: string };

export function registerConnectionHandlers(socket: Socket) {
  socket.on("join:backlog", (payload: JoinBacklogPayload) => joinBacklogRoom(socket, payload));
  socket.on("leave:backlog", (payload: JoinBacklogPayload) => leaveBacklogRoom(socket, payload));
  socket.on("join:sprint-board", (payload: JoinSprintBoardPayload) => joinSprintBoardRoom(socket, payload));
  socket.on("leave:sprint-board", (payload: JoinSprintBoardPayload) => leaveSprintBoardRoom(socket, payload));
}

async function joinBacklogRoom(socket: Socket, payload: JoinBacklogPayload) {
  try {
    await checkRequesterCanJoinBacklogRoom(payload.projectId, getRequesterId(socket));
    await socket.join(buildBacklogRoomName(payload.projectId));
  } catch {
    // The requester isn't allowed to see this project's backlog — the socket
    // simply never joins the room, so it never receives its events.
  }
}

function leaveBacklogRoom(socket: Socket, payload: JoinBacklogPayload) {
  socket.leave(buildBacklogRoomName(payload.projectId));
}

async function joinSprintBoardRoom(socket: Socket, payload: JoinSprintBoardPayload) {
  try {
    await checkRequesterCanJoinSprintBoardRoom(payload.sprintId, getRequesterId(socket));
    await socket.join(buildSprintBoardRoomName(payload.sprintId));
  } catch {
    // Same reasoning as joinBacklogRoom: fail closed, no room join.
  }
}

function leaveSprintBoardRoom(socket: Socket, payload: JoinSprintBoardPayload) {
  socket.leave(buildSprintBoardRoomName(payload.sprintId));
}

function getRequesterId(socket: Socket): string {
  return socket.data.userId as string;
}
