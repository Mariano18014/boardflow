import { io, type Socket } from "socket.io-client";
import { getSession } from "@/components/modules/auth/auth-session.store";

let socket: Socket | null = null;

// A single socket is shared across every screen that needs realtime updates
// (Backlog, Sprint Board, ...) instead of opening a new connection per
// screen. auth is a callback so socket.io-client re-reads the current access
// token on every (re)connection attempt, instead of freezing it at the
// moment the socket was first created.
export function getSocket(): Socket {
  if (socket === null) {
    socket = io({ auth: sendCurrentAccessToken });
  }
  return socket;
}

function sendCurrentAccessToken(callback: (data: object) => void) {
  callback({ token: getSession()?.accessToken });
}
