import { Link } from "wouter";
import type { OrganizationProject } from "./list-organization-projects.api";
import { ArchiveProjectButton } from "./ArchiveProjectButton";

type ProjectCardProps = {
  project: OrganizationProject;
  organizationId: string;
  canArchiveProjects: boolean;
};

export function ProjectCard({ project, organizationId, canArchiveProjects }: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4">
      <Link href={`/projects/${project.id}`} className="flex flex-col gap-2">
        <div className="text-xs font-mono text-text-3">{project.key}</div>
        <div className="font-heading font-semibold text-sm truncate">{project.name}</div>
        <div className="text-xs text-muted-foreground">{formatBoardsCountLabel(project.boardsCount)}</div>
      </Link>
      {canArchiveProjects && (
        <ArchiveProjectButton
          organizationId={organizationId}
          projectId={project.id}
          projectName={project.name}
        />
      )}
    </div>
  );
}

function formatBoardsCountLabel(boardsCount: number): string {
  if (boardsCount === 1) {
    return "1 board";
  }
  return `${boardsCount} boards`;
}
