import { io, type Socket } from "socket.io-client";
import { getSession } from "@/components/modules/auth/auth-session.store";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket === null) {
    socket = io({ auth: sendCurrentAccessToken });
  }
  return socket;
}

function sendCurrentAccessToken(callback: (data: object) => void) {
  callback({ token: getSession()?.accessToken });
}
