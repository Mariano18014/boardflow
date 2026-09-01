import { useEffect, useRef } from "react";
import { getSocket } from "./socket-connection";

const JOIN_SPRINT_BOARD_EVENT = "join:sprint-board";
const LEAVE_SPRINT_BOARD_EVENT = "leave:sprint-board";
const BOARD_CHANGED_EVENT = "board:changed";

// Joins the sprint-board:{sprintId} room while a Sprint Board screen is
// mounted, and calls onBoardChanged both when the server signals a change and
// right after a reconnect (so a client that was briefly offline still ends up
// with a fresh board instead of a stale one).
export function useSprintBoardRealtimeSync(sprintId: string | undefined, onBoardChanged: () => void) {
  const onBoardChangedRef = useRef(onBoardChanged);

  useEffect(() => {
    onBoardChangedRef.current = onBoardChanged;
  }, [onBoardChanged]);

  useEffect(() => {
    if (sprintId === undefined) {
      return;
    }
    const socket = getSocket();

    function joinRoom() {
      socket.emit(JOIN_SPRINT_BOARD_EVENT, { sprintId });
    }

    function handleBoardChanged() {
      onBoardChangedRef.current();
    }

    function handleReconnect() {
      joinRoom();
      handleBoardChanged();
    }

    joinRoom();
    socket.on(BOARD_CHANGED_EVENT, handleBoardChanged);
    socket.on("connect", handleReconnect);

    return () => {
      socket.emit(LEAVE_SPRINT_BOARD_EVENT, { sprintId });
      socket.off(BOARD_CHANGED_EVENT, handleBoardChanged);
      socket.off("connect", handleReconnect);
    };
  }, [sprintId]);
}
