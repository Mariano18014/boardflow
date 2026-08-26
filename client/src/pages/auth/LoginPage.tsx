import { Link } from "wouter";
import { LoginForm } from "@/components/modules/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingresá con tu email y contraseña para acceder a tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-primary underline-offset-4 hover:underline">
              Registrarme
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
