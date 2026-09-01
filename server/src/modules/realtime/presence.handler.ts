import { getRealtimeServer } from "./realtime-server";
import { buildSprintBoardRoomName } from "./realtime-rooms.util";
import {
  addSocketToPresenceRegistry,
  getEntriesForSprint,
  removeSocketFromPresenceRegistry,
  type PresenceEntry,
} from "./presence-registry";
import type { AuthenticatedSocket } from "./realtime.types";

const PRESENCE_UPDATED_EVENT = "presence:updated";

export type PresentUser = {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
};

export function handleSprintBoardJoin(socket: AuthenticatedSocket, sprintId: string): void {
  addSocketToPresenceRegistry(sprintId, socket);
  const presentUsers = buildPresentUsersList(sprintId);
  broadcastPresenceUpdate(sprintId, presentUsers);
}

export function handleSprintBoardLeaveOrDisconnect(socket: AuthenticatedSocket, sprintId: string): void {
  removeSocketFromPresenceRegistry(sprintId, socket);
  const presentUsers = buildPresentUsersList(sprintId);
  broadcastPresenceUpdate(sprintId, presentUsers);
}

function buildPresentUsersList(sprintId: string): PresentUser[] {
  const entries = getEntriesForSprint(sprintId);
  const uniqueEntries = deduplicateByUserId(entries);
  return uniqueEntries.map(mapEntryToPresentUser);
}

// The same user can hold the board open in two tabs/devices at once (two
// sockets, one userId) — keeps only the first entry seen per userId so they
// still show up exactly once in the presence list.
function deduplicateByUserId(entries: PresenceEntry[]): PresenceEntry[] {
  const seenUserIds = new Set<string>();
  const uniqueEntries: PresenceEntry[] = [];
  for (const entry of entries) {
    if (seenUserIds.has(entry.userId)) {
      continue;
    }
    seenUserIds.add(entry.userId);
    uniqueEntries.push(entry);
  }
  return uniqueEntries;
}

function mapEntryToPresentUser(entry: PresenceEntry): PresentUser {
  return { userId: entry.userId, fullName: entry.fullName, avatarUrl: entry.avatarUrl };
}

function broadcastPresenceUpdate(sprintId: string, presentUsers: PresentUser[]): void {
  getRealtimeServer().to(buildSprintBoardRoomName(sprintId)).emit(PRESENCE_UPDATED_EVENT, presentUsers);
}
