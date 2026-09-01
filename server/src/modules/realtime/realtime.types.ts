import type { Socket } from "socket.io";

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
