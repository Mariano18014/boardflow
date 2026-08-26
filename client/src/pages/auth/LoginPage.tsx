import { Link, useSearch } from "wouter";
import { LoginForm } from "@/components/modules/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseInvitationTokenFromQueryString } from "@/components/modules/invitations/parse-invitation-token";
import { useInvitationDetails } from "@/components/modules/invitations/use-invitation-details";

export default function LoginPage() {
  const search = useSearch();
  const invitationToken = parseInvitationTokenFromQueryString(search);
  const { data: invitation, isLoading: isLoadingInvitation } = useInvitationDetails(
    invitationToken ?? "",
  );

  if (invitationToken && isLoadingInvitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <p className="text-sm text-muted-foreground">Cargando invitación...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingresá con tu email y contraseña para acceder a tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm invitationToken={invitationToken ?? undefined} lockedEmail={invitation?.email} />
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
