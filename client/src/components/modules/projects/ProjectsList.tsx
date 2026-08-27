import type { ReactNode } from "react";
import type { OrganizationProject } from "./list-organization-projects.api";
import { ProjectCard } from "./ProjectCard";

type ProjectsListProps = {
  projects: OrganizationProject[];
  emptyStateAction?: ReactNode;
};

export function ProjectsList({ projects, emptyStateAction }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          Todavía no hay proyectos en esta organización.
        </p>
        {emptyStateAction}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3.5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
