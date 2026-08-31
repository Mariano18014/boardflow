import { AppShell } from "@/components/layout/AppShell";
import { CreateProjectDialog } from "@/components/modules/projects/CreateProjectDialog";
import { ProjectsList } from "@/components/modules/projects/ProjectsList";
import { ArchivedProjectsSection } from "@/components/modules/projects/ArchivedProjectsSection";
import { useOrganizationProjects } from "@/components/modules/projects/use-organization-projects";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";

export default function ProjectsPage() {
  const { organization } = useCurrentOrganization();
  const { hasPermission } = useHasPermission(organization?.id);
  const canCreateProjects = hasPermission("projects:create");
  const canArchiveProjects = hasPermission("projects:delete");
  const canRestoreProjects = hasPermission("projects:edit");
  const { data: projects, isLoading, isError } = useOrganizationProjects(organization?.id);
  const activeProjects = projects?.filter((project) => !project.isArchived) ?? [];
  const archivedProjects = projects?.filter((project) => project.isArchived) ?? [];
  const hasActiveProjects = activeProjects.length > 0;

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
          {canCreateProjects && organization && hasActiveProjects && (
            <CreateProjectDialog organizationId={organization.id} />
          )}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando proyectos...</p>}
        {isError && (
          <p className="text-sm text-destructive">No se pudo cargar el listado de proyectos.</p>
        )}
        {projects && organization && (
          <>
            <ProjectsList
              projects={activeProjects}
              organizationId={organization.id}
              canArchiveProjects={canArchiveProjects}
              emptyStateAction={
                canCreateProjects ? <CreateProjectDialog organizationId={organization.id} /> : undefined
              }
            />
            <ArchivedProjectsSection
              projects={archivedProjects}
              organizationId={organization.id}
              canRestoreProjects={canRestoreProjects}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
