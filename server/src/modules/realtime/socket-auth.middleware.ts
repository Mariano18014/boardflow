import { verifyAccessToken } from "../../lib/jwt";
import { findUserById } from "../../db/repositories/user.repository";
import type { AuthenticatedSocket, AuthenticatedSocketData } from "./realtime.types";

type SocketAuthNextFunction = (err?: Error) => void;

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
