import { useEffect, type ComponentType } from "react";
import { useLocation } from "wouter";
import { useAuthSession } from "@/components/modules/auth/use-auth-session";
import { useOrganizations } from "./use-organizations";

type RequireNoOrganizationProps = {
  component: ComponentType;
};

export function RequireNoOrganization({ component: Component }: RequireNoOrganizationProps) {
  const session = useAuthSession();
  const { data: organizations, isLoading } = useOrganizations();
  const [, navigate] = useLocation();
  const hasOrganizations = !isLoading && !!organizations && organizations.length > 0;

  useEffect(() => {
    if (!session) {
      redirectToLogin(navigate);
      return;
    }
    if (hasOrganizations) {
      redirectToDashboard(navigate);
    }
  }, [session, hasOrganizations, navigate]);

  if (!session || isLoading || hasOrganizations) {
    return null;
  }

  return <Component />;
}

function redirectToLogin(navigate: (path: string) => void) {
  navigate("/login");
}

function redirectToDashboard(navigate: (path: string) => void) {
  navigate("/dashboard");
}
