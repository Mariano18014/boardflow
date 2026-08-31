import { Link } from "wouter";
import type { OrganizationProject } from "./list-organization-projects.api";
import { RestoreProjectButton } from "./RestoreProjectButton";

type ArchivedProjectRowProps = {
  project: OrganizationProject;
  organizationId: string;
  canRestoreProjects: boolean;
};

export function ArchivedProjectRow({
  project,
  organizationId,
  canRestoreProjects,
}: ArchivedProjectRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3">
      <Link href={`/projects/${project.id}`} className="flex min-w-0 flex-col gap-1">
        <div className="text-xs font-mono text-text-3">{project.key}</div>
        <div className="font-heading font-semibold text-sm truncate">{project.name}</div>
      </Link>
      {canRestoreProjects && (
        <RestoreProjectButton organizationId={organizationId} projectId={project.id} />
      )}
    </div>
  );
}
