import { useEffect, type ComponentType } from "react";
import { useLocation } from "wouter";
import { useAuthSession } from "./use-auth-session";

type ProtectedRouteProps = {
  component: ComponentType;
};

export function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const session = useAuthSession();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!session) {
      redirectToLogin(navigate);
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return <Component />;
}

function redirectToLogin(navigate: (path: string) => void) {
  navigate("/login");
}
