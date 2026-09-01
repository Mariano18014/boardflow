import type { Socket } from "socket.io";
import { verifyAccessToken } from "../../lib/jwt";

type SocketAuthNextFunction = (err?: Error) => void;

// Reuses the same verifyAccessToken used by auth.middleware.ts for HTTP
// requests — the only difference is where the token comes from (the
// handshake's auth payload instead of an Authorization header).
export function authenticateSocketConnection(socket: Socket, next: SocketAuthNextFunction) {
  try {
    const token = extractTokenFromHandshake(socket);
    const payload = verifyAccessToken(token);
    attachUserIdToSocket(socket, payload.sub);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}

function extractTokenFromHandshake(socket: Socket): string {
  const token = socket.handshake.auth.token;
  if (typeof token !== "string" || token.length === 0) {
    throw new Error("Missing token");
  }
  return token;
}

function attachUserIdToSocket(socket: Socket, userId: string) {
  socket.data.userId = userId;
}
