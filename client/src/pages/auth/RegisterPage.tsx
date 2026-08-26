import { Link } from "wouter";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-2">
      <h1 className="text-2xl font-heading font-semibold">Registrarme</h1>
      <p className="text-muted-foreground">Esta pantalla todavía no está implementada.</p>
      <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
