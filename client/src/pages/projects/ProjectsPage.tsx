import { AppShell } from "@/components/layout/AppShell";
import { CreateProjectDialog } from "@/components/modules/projects/CreateProjectDialog";
import { ProjectsList } from "@/components/modules/projects/ProjectsList";
import { useOrganizationProjects } from "@/components/modules/projects/use-organization-projects";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";

export default function ProjectsPage() {
  const { organization } = useCurrentOrganization();
  const { hasPermission } = useHasPermission(organization?.id);
  const canCreateProjects = hasPermission("projects:create");
  const { data: projects, isLoading, isError } = useOrganizationProjects(organization?.id);
  const hasProjects = (projects?.length ?? 0) > 0;

  return (
    <AppShell title="Proyectos">
      <div className="p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-xl font-bold mb-1">Proyectos</h1>
            <p className="text-sm text-muted-foreground">
              Todos los proyectos de esta organización.
            </p>
          </div>
          {canCreateProjects && organization && hasProjects && (
            <CreateProjectDialog organizationId={organization.id} />
          )}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando proyectos...</p>}
        {isError && (
          <p className="text-sm text-destructive">No se pudo cargar el listado de proyectos.</p>
        )}
        {projects && (
          <ProjectsList
            projects={projects}
            emptyStateAction={
              canCreateProjects && organization ? (
                <CreateProjectDialog organizationId={organization.id} />
              ) : undefined
            }
          />
        )}
      </div>
    </AppShell>
  );
}
