import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { OrganizationProject } from "./list-organization-projects.api";
import { ArchivedProjectRow } from "./ArchivedProjectRow";

type ArchivedProjectsSectionProps = {
  projects: OrganizationProject[];
  organizationId: string;
  canRestoreProjects: boolean;
};

export function ArchivedProjectsSection({
  projects,
  organizationId,
  canRestoreProjects,
}: ArchivedProjectsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (projects.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-8">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="px-0 text-[11px] font-semibold uppercase tracking-wide text-text-3"
        >
          {isOpen ? "Ocultar archivados" : `Archivados (${projects.length})`}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2.5 flex flex-col gap-2">
        {projects.map((project) => (
          <ArchivedProjectRow
            key={project.id}
            project={project}
            organizationId={organizationId}
            canRestoreProjects={canRestoreProjects}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
