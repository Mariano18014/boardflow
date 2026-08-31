import { useEffect, type ComponentType } from "react";
import { useLocation } from "wouter";
import { useAuthSession } from "./use-auth-session";

type RequireAuthProps = {
  component: ComponentType;
};

// Unlike RequireOrganization, this guard only checks for a valid session — it
// is for screens like "my profile" that are not scoped to any organization.
export function RequireAuth({ component: Component }: RequireAuthProps) {
  const session = useAuthSession();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return <Component />;
}
