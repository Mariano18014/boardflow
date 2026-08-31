import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvitationDetails } from "@/components/modules/invitations/use-invitation-details";
import { InvitationApiError } from "@/components/modules/invitations/invitation-api-error";

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const { data: invitation, isLoading, isError, error } = useInvitationDetails(token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Invitación</CardTitle>
          {invitation && (
            <CardDescription>
              Fuiste invitado a unirte a <strong>{invitation.organizationName}</strong> como{" "}
              {invitation.roleName}.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando invitación...</p>}
          {isError && <p className="text-sm text-destructive">{describeInvitationError(error)}</p>}
          {invitation && (
            <>
              <p className="text-sm text-muted-foreground">
                Invitado con el email <strong>{invitation.email}</strong>.
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href={`/login?token=${token}`}>Ya tengo cuenta</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/register?token=${token}`}>Soy nuevo</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function describeInvitationError(error: unknown): string {
  if (error instanceof InvitationApiError) {
    return error.message;
  }
  return "No se pudo cargar la invitación.";
}
