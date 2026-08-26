import { useSyncExternalStore } from "react";
import { getSession, subscribeToSession } from "./auth-session.store";

export function useAuthSession() {
  return useSyncExternalStore(subscribeToSession, getSession, getSession);
}
