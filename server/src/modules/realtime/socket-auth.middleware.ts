import { verifyAccessToken } from "../../lib/jwt";
import { findUserById } from "../../db/repositories/user.repository";
import type { AuthenticatedSocket, AuthenticatedSocketData } from "./realtime.types";

type SocketAuthNextFunction = (err?: Error) => void;

// Reuses the same verifyAccessToken used by auth.middleware.ts for HTTP
// requests — the only difference is where the token comes from (the
// handshake's auth payload instead of an Authorization header). Also looks up
// the user's fullName/avatarUrl here, once per connection, so presence
// (HU-41) doesn't need a second round trip when a socket joins a room.
export async function authenticateSocketConnection(socket: AuthenticatedSocket, next: SocketAuthNextFunction) {
  try {
    const token = extractTokenFromHandshake(socket);
    const payload = verifyAccessToken(token);
    const user = await findAuthenticatedUser(payload.sub);
    attachUserDataToSocket(socket, user);
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}

function extractTokenFromHandshake(socket: AuthenticatedSocket): string {
  const token = socket.handshake.auth.token;
  if (typeof token !== "string" || token.length === 0) {
    throw new Error("Missing token");
  }
  return token;
}

async function findAuthenticatedUser(userId: string) {
  const user = await findUserById(userId);
  if (user === null) {
    throw new Error("User not found");
  }
  return user;
}

function attachUserDataToSocket(socket: AuthenticatedSocket, user: { id: string; fullName: string; avatarUrl: string | null }) {
  const socketData: AuthenticatedSocketData = {
    userId: user.id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
  };
  socket.data = socketData;
}
