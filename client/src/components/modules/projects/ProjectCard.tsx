import { Link } from "wouter";
import type { OrganizationProject } from "./list-organization-projects.api";

type ProjectCardProps = {
  project: OrganizationProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4"
    >
      <div className="text-xs font-mono text-text-3">{project.key}</div>
      <div className="font-heading font-semibold text-sm truncate">{project.name}</div>
      <div className="text-xs text-muted-foreground">{formatBoardsCountLabel(project.boardsCount)}</div>
    </Link>
  );
}

function formatBoardsCountLabel(boardsCount: number): string {
  if (boardsCount === 1) {
    return "1 board";
  }
  return `${boardsCount} boards`;
}
