import { useEffect, type ComponentType } from "react";
import { useLocation } from "wouter";
import { useAuthSession } from "@/components/modules/auth/use-auth-session";
import { useOrganizations } from "./use-organizations";

type RequireOrganizationProps = {
  component: ComponentType;
};

export function RequireOrganization({ component: Component }: RequireOrganizationProps) {
  const session = useAuthSession();
  const { data: organizations, isLoading } = useOrganizations();
  const [, navigate] = useLocation();
  const hasNoOrganizations = !isLoading && !!organizations && organizations.length === 0;

  useEffect(() => {
    if (!session) {
      redirectToLogin(navigate);
      return;
    }
    if (hasNoOrganizations) {
      redirectToOnboarding(navigate);
    }
  }, [session, hasNoOrganizations, navigate]);

  if (!session || isLoading || hasNoOrganizations) {
    return null;
  }

  return <Component />;
}

function redirectToLogin(navigate: (path: string) => void) {
  navigate("/login");
}

function redirectToOnboarding(navigate: (path: string) => void) {
  navigate("/onboarding");
}
