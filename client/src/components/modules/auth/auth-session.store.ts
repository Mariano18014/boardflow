export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  status: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
};

type SessionListener = () => void;

let currentSession: AuthSession | null = null;
const listeners = new Set<SessionListener>();

export function getSession(): AuthSession | null {
  return currentSession;
}

export function setSession(session: AuthSession) {
  currentSession = session;
  notifyListeners();
}

export function clearSession() {
  currentSession = null;
  notifyListeners();
}

export function subscribeToSession(listener: SessionListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}
