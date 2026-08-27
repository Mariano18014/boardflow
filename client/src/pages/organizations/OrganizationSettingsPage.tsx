import { Link } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationLogoUpload } from "@/components/modules/organizations/OrganizationLogoUpload";
import { OrganizationSettingsForm } from "@/components/modules/organizations/OrganizationSettingsForm";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";

export default function OrganizationSettingsPage() {
  const { organization } = useCurrentOrganization();
  const { hasPermission } = useHasPermission(organization?.id);
  const canEditOrganization = hasPermission("organizations:edit");

  return (
    <AppShell title="Configuración">
      <div className="p-7 max-w-md flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Organización</CardTitle>
            <CardDescription>
              {canEditOrganization
                ? "Personalizá el nombre y el logo de tu organización."
                : "No tenés permiso para editar estos datos."}
            </CardDescription>
          </CardHeader>
          {canEditOrganization && organization && (
            <CardContent className="flex flex-col gap-6">
              <OrganizationLogoUpload
                organizationId={organization.id}
                organizationName={organization.name}
                currentLogoUrl={organization.logoUrl}
              />
              <OrganizationSettingsForm
                organizationId={organization.id}
                currentName={organization.name}
              />
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Roles y permisos</CardTitle>
            <CardDescription>Consultá los roles de la organización y creá roles personalizados.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings/roles" className="text-sm text-primary underline-offset-4 hover:underline">
              Ver roles y permisos
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
