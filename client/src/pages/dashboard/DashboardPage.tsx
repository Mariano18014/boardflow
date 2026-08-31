import { Link } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthSession } from "@/components/modules/auth/use-auth-session";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";
import { CreateProjectDialog } from "@/components/modules/projects/CreateProjectDialog";
import { useProjects } from "@/components/modules/projects/use-projects";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";

export default function DashboardPage() {
  const session = useAuthSession();
  const { organization: currentOrganization } = useCurrentOrganization();
  const { data: projects } = useProjects(currentOrganization?.id);
  const { hasPermission } = useHasPermission(currentOrganization?.id);
  const canCreateProjects = hasPermission("projects:create");

  return (
    <AppShell title="Dashboard">
      <div className="p-7">
        <h1 className="font-heading text-xl font-bold mb-1">
          Hola de nuevo, {session?.user.fullName}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Esto es lo que está pasando en tus organizaciones.
        </p>

        <div className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-2.5">
          Tus organizaciones
        </div>
        <div className="grid grid-cols-2 gap-3.5 mb-8">
          {currentOrganization && (
            <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-4">
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarFallback className="rounded-lg bg-accent text-accent-foreground font-heading font-bold">
                  {currentOrganization.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-heading font-semibold text-sm truncate">
                  {currentOrganization.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {currentOrganization.slug}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-text-3">
            Tus proyectos
          </div>
          {canCreateProjects && currentOrganization && (
            <CreateProjectDialog organizationId={currentOrganization.id} />
          )}
        </div>
        {projects && projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no creaste ningún proyecto en esta organización.
          </p>
        )}
        <div className="grid grid-cols-3 gap-3.5">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4"
            >
              <div className="text-xs font-mono text-text-3">{project.key}</div>
              <div className="font-heading font-semibold text-sm">{project.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
