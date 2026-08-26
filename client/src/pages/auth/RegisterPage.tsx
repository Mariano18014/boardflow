import { Link, useSearch } from "wouter";
import { RegisterForm } from "@/components/modules/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseInvitationTokenFromQueryString } from "@/components/modules/invitations/parse-invitation-token";
import { useInvitationDetails } from "@/components/modules/invitations/use-invitation-details";

export default function RegisterPage() {
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
          <CardTitle className="font-heading text-2xl">Creá tu cuenta</CardTitle>
          <CardDescription>
            Registrate para empezar a organizar tus proyectos con BoardFlow.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RegisterForm
            invitationToken={invitationToken ?? undefined}
            lockedEmail={invitation?.email}
          />
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
