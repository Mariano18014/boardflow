import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <span className="font-heading text-lg font-semibold text-foreground">BoardFlow</span>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" asChild>
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/register" asChild>
            <Button variant="default" size="sm">
              Registrarme
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
