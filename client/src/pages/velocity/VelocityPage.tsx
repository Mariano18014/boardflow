import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useProjectVelocity } from "@/components/modules/sprints/use-project-velocity";
import { VelocityChart } from "@/components/modules/sprints/VelocityChart";

export default function VelocityPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);
  const { data: velocityData, isLoading, isError } = useProjectVelocity(
    project?.organizationId,
    projectId,
  );

  return (
    <AppShell title="Velocity">
      <div className="p-7">
        <h1 className="font-heading text-xl font-bold mb-1">Velocity</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Puntos completados por sprint, para estimar mejor los próximos.
        </p>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando velocity...</p>}
        {isError && (
          <p className="text-sm text-destructive">No se pudo cargar la velocity de este proyecto.</p>
        )}
        {velocityData && velocityData.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay sprints cerrados en este proyecto. La velocity va a mostrarse acá una vez que
            se cierre el primero.
          </p>
        )}
        {velocityData && velocityData.length > 0 && <VelocityChart velocityData={velocityData} />}
      </div>
    </AppShell>
  );
}
