import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLogTimeline } from "@/components/modules/activity-log/ActivityLogTimeline";
import { useActivityLog } from "@/components/modules/activity-log/use-activity-log";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";

export default function OrganizationActivityPage() {
  const { organization } = useCurrentOrganization();
  const { hasPermission } = useHasPermission(organization?.id);
  const canViewActivity = hasPermission("activity:view");
  const { data: entries, isLoading } = useActivityLog(organization?.id, canViewActivity);

  return (
    <AppShell title="Actividad">
      <div className="p-7 max-w-2xl flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Actividad reciente</CardTitle>
            <CardDescription>
              {canViewActivity
                ? "Cambios recientes en esta organización, sus miembros y proyectos."
                : "No tenés permiso para ver la actividad de esta organización."}
            </CardDescription>
          </CardHeader>
          {canViewActivity && (
            <CardContent>
              {isLoading && <p className="text-sm text-muted-foreground">Cargando actividad...</p>}
              {entries && <ActivityLogTimeline entries={entries} />}
            </CardContent>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
