import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationLogoUpload } from "@/components/modules/organizations/OrganizationLogoUpload";
import { OrganizationSettingsForm } from "@/components/modules/organizations/OrganizationSettingsForm";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";

export default function OrganizationSettingsPage() {
  const { organization } = useCurrentOrganization();
  const canEditOrganization = organization?.roleName === "owner";

  return (
    <AppShell title="Configuración">
      <div className="p-7 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Organización</CardTitle>
            <CardDescription>
              {canEditOrganization
                ? "Personalizá el nombre y el logo de tu organización."
                : "Solo el owner de la organización puede editar estos datos."}
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
      </div>
    </AppShell>
  );
}
