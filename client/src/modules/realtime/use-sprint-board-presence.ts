import { useEffect, useState } from "react";
import { getSocket } from "./socket-connection";

const PRESENCE_UPDATED_EVENT = "presence:updated";

export type PresentUser = {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
};

export function useSprintBoardPresence(sprintId: string | undefined): PresentUser[] {
  const [presentUsers, setPresentUsers] = useState<PresentUser[]>([]);

  useEffect(() => {
    setPresentUsers([]);
    if (sprintId === undefined) {
      return;
    }
    const socket = getSocket();

    function handlePresenceUpdated(updatedPresentUsers: PresentUser[]) {
      setPresentUsers(updatedPresentUsers);
    }

    socket.on(PRESENCE_UPDATED_EVENT, handlePresenceUpdated);

    return () => {
      socket.off(PRESENCE_UPDATED_EVENT, handlePresenceUpdated);
    };
  }, [sprintId]);

  return presentUsers;
}
