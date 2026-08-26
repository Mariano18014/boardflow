import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { clearSession } from "@/components/modules/auth/auth-session.store";

type AppTopbarProps = {
  title: string;
};

export function AppTopbar({ title }: AppTopbarProps) {
  const [, navigate] = useLocation();

  function logOut() {
    clearSession();
    navigate("/login");
  }

  return (
    <header className="h-14 flex-none border-b border-border bg-surface flex items-center px-5">
      <span className="font-heading font-semibold text-sm">{title}</span>
      <Button variant="ghost" size="sm" className="ml-auto" onClick={logOut}>
        Cerrar sesión
      </Button>
    </header>
  );
}
