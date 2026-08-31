import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-primary px-6 py-10 text-center text-primary-foreground sm:py-14">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
          Empezá a ordenar tus proyectos hoy
        </h2>
        <p className="max-w-xl text-sm text-primary-foreground/80 sm:text-base">
          Creá tu cuenta en minutos y sumá a tu equipo a BoardFlow.
        </p>
        <Link href="/register" asChild>
          <Button variant="secondary" size="lg">
            Registrarme
          </Button>
        </Link>
      </div>
    </section>
  );
}
