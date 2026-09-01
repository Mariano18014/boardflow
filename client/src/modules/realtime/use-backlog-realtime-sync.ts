import { useEffect, useRef } from "react";
import { getSocket } from "./socket-connection";

const JOIN_BACKLOG_EVENT = "join:backlog";
const LEAVE_BACKLOG_EVENT = "leave:backlog";
const BACKLOG_CHANGED_EVENT = "backlog:changed";

// Joins the backlog:{projectId} room while a Backlog screen is mounted, and
// calls onBacklogChanged both when the server signals a change and right
// after a reconnect (so a client that was briefly offline still ends up with
// fresh data instead of a stale backlog).
export function useBacklogRealtimeSync(projectId: string | undefined, onBacklogChanged: () => void) {
  const onBacklogChangedRef = useRef(onBacklogChanged);

  useEffect(() => {
    onBacklogChangedRef.current = onBacklogChanged;
  }, [onBacklogChanged]);

  useEffect(() => {
    if (projectId === undefined) {
      return;
    }
    const socket = getSocket();

    function joinRoom() {
      socket.emit(JOIN_BACKLOG_EVENT, { projectId });
    }

    function handleBacklogChanged() {
      onBacklogChangedRef.current();
    }

    function handleReconnect() {
      joinRoom();
      handleBacklogChanged();
    }

    joinRoom();
    socket.on(BACKLOG_CHANGED_EVENT, handleBacklogChanged);
    socket.on("connect", handleReconnect);

    return () => {
      socket.emit(LEAVE_BACKLOG_EVENT, { projectId });
      socket.off(BACKLOG_CHANGED_EVENT, handleBacklogChanged);
      socket.off("connect", handleReconnect);
    };
  }, [projectId]);
}
