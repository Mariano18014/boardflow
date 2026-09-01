import type { Socket } from "socket.io";

// What authenticateSocketConnection attaches to socket.data once the
// handshake JWT is verified — every other realtime module relies on this
// shape being present, instead of re-reading the token or hitting the
// database again.
export type AuthenticatedSocketData = {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
};

export type AuthenticatedSocket = Socket<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  AuthenticatedSocketData
>;
