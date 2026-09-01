import type { AuthenticatedSocket } from "./realtime.types";

export type PresenceEntry = {
  socketId: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
};

const presenceBySprintId = new Map<string, PresenceEntry[]>();

export function addSocketToPresenceRegistry(sprintId: string, socket: AuthenticatedSocket): void {
  const entry = buildPresenceEntryFromSocket(socket);
  const currentEntries = getEntriesForSprint(sprintId);
  presenceBySprintId.set(sprintId, [...currentEntries, entry]);
}

export function removeSocketFromPresenceRegistry(sprintId: string, socket: AuthenticatedSocket): void {
  const currentEntries = getEntriesForSprint(sprintId);
  const remainingEntries = currentEntries.filter((entry) => entry.socketId !== socket.id);
  presenceBySprintId.set(sprintId, remainingEntries);
}

export function getEntriesForSprint(sprintId: string): PresenceEntry[] {
  return presenceBySprintId.get(sprintId) ?? [];
}

function buildPresenceEntryFromSocket(socket: AuthenticatedSocket): PresenceEntry {
  return {
    socketId: socket.id,
    userId: socket.data.userId,
    fullName: socket.data.fullName,
    avatarUrl: socket.data.avatarUrl,
  };
}
