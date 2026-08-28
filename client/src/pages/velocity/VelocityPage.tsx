import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "@/components/modules/projects/use-project";
import { useActiveSprint } from "@/components/modules/sprints/use-sprints";
import { useProjectVelocity } from "@/components/modules/sprints/use-project-velocity";
import { VelocityChart } from "@/components/modules/sprints/VelocityChart";
import { useSprintBurndown } from "@/components/modules/sprints/use-sprint-burndown";
import { BurndownChart } from "@/components/modules/sprints/BurndownChart";

export default function VelocityPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);

  return (
    <AppShell title="Reportes">
      <div className="p-7">
        <h1 className="font-heading text-xl font-bold mb-1">Reportes</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Velocity histórica del proyecto y avance del sprint activo.
        </p>

        <Tabs defaultValue="velocity">
          <TabsList>
            <TabsTrigger value="velocity">Velocity</TabsTrigger>
            <TabsTrigger value="burndown">Burndown</TabsTrigger>
          </TabsList>
          <TabsContent value="velocity">
            <VelocityTabContent organizationId={project?.organizationId} projectId={projectId} />
          </TabsContent>
          <TabsContent value="burndown">
            <BurndownTabContent organizationId={project?.organizationId} projectId={projectId} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

type VelocityTabContentProps = {
  organizationId: string | undefined;
  projectId: string;
};

function VelocityTabContent({ organizationId, projectId }: VelocityTabContentProps) {
  const { data: velocityData, isLoading, isError } = useProjectVelocity(organizationId, projectId);

  return (
    <div className="mt-4">
      {isLoading && <p className="text-sm text-muted-foreground">Cargando velocity...</p>}
      {isError && <p className="text-sm text-destructive">No se pudo cargar la velocity de este proyecto.</p>}
      {velocityData && velocityData.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Todavía no hay sprints cerrados en este proyecto. La velocity va a mostrarse acá una vez que se
          cierre el primero.
        </p>
      )}
      {velocityData && velocityData.length > 0 && <VelocityChart velocityData={velocityData} />}
    </div>
  );
}

type BurndownTabContentProps = {
  organizationId: string | undefined;
  projectId: string;
};

function BurndownTabContent({ organizationId, projectId }: BurndownTabContentProps) {
  const { data: activeSprint, isLoading: isLoadingActiveSprint } = useActiveSprint(organizationId, projectId);
  const {
    data: burndown,
    isLoading: isLoadingBurndown,
    isError,
  } = useSprintBurndown(organizationId, projectId, activeSprint?.id);

  return (
    <div className="mt-4">
      {isLoadingActiveSprint && <p className="text-sm text-muted-foreground">Buscando sprint activo...</p>}
      {!isLoadingActiveSprint && !activeSprint && (
        <p className="text-sm text-muted-foreground">
          No hay un sprint activo en este proyecto. El burndown se muestra acá una vez que inicies uno.
        </p>
      )}
      {activeSprint && isLoadingBurndown && (
        <p className="text-sm text-muted-foreground">Cargando burndown...</p>
      )}
      {activeSprint && isError && (
        <p className="text-sm text-destructive">No se pudo cargar el burndown de este sprint.</p>
      )}
      {activeSprint && burndown && <BurndownChart burndown={burndown} />}
    </div>
  );
}
