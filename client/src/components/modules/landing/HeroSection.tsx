import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24">
      <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-5xl">
        Gestioná tus proyectos con un flujo Scrum simple y claro
      </h1>
      <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
        BoardFlow reúne organizaciones, proyectos, backlogs y sprints en un solo lugar, con roles
        y permisos a medida de tu equipo.
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="/register" asChild>
          <Button size="lg" className="w-full sm:w-auto">
            Registrarme gratis
          </Button>
        </Link>
        <Link href="/login" asChild>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    </section>
  );
}
