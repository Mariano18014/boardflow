import { Link, useRoute } from "wouter";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthSession } from "@/components/modules/auth/use-auth-session";
import { useCurrentOrganization } from "@/components/modules/organizations/use-current-organization";
import { useProjects } from "@/components/modules/projects/use-projects";
import { getInitials } from "@/lib/utils";

export function AppSidebar() {
  const session = useAuthSession();
  const { organization: currentOrganization } = useCurrentOrganization();
  const { data: projects } = useProjects(currentOrganization?.id);
  const [, activeParams] = useRoute<{ projectId: string }>("/projects/:projectId");

  return (
    <aside className="w-60 flex-none border-r border-border bg-surface flex flex-col p-3">
      {currentOrganization && (
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 py-2 mb-5">
          <div className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-primary text-primary-foreground text-[11px] font-heading font-bold">
            {currentOrganization.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-heading font-semibold text-sm truncate">
            {currentOrganization.name}
          </span>
        </div>
      )}

      <div className="text-[11px] font-semibold uppercase tracking-wide text-text-3 px-2 mb-1.5">
        Proyectos
      </div>
      {projects && projects.length === 0 && (
        <p className="text-xs text-muted-foreground px-2">Todavía no tenés proyectos.</p>
      )}
      <nav className="flex flex-col gap-0.5">
        {projects?.map((project) => {
          const isActive = activeParams?.projectId === project.id;
          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm font-medium truncate",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {project.name}
            </Link>
          );
        })}
      </nav>

      {session && (
        <div className="mt-auto flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-accent text-accent-foreground text-[10px] font-heading font-semibold">
              {getInitials(session.user.fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm truncate">{session.user.fullName}</span>
        </div>
      )}
    </aside>
  );
}
