import { useParams } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useProject } from "@/components/modules/projects/use-project";
import { useHasPermission } from "@/components/modules/permissions/use-has-permission";
import { useLabels } from "@/components/modules/labels/use-labels";
import { LabelsList } from "@/components/modules/labels/LabelsList";
import { CreateLabelDialog } from "@/components/modules/labels/CreateLabelDialog";

export default function ProjectLabelsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId);
  const { hasPermission } = useHasPermission(project?.organizationId);
  const canCreateLabels = hasPermission("labels:create");
  const { data: labels, isLoading, isError } = useLabels(project?.organizationId, projectId);

  return (
    <AppShell title="Labels">
      <div className="p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold mb-1">Labels</h1>
            <p className="text-sm text-muted-foreground">
              Labels para categorizar las tareas de este proyecto.
            </p>
          </div>
          {project && canCreateLabels && (
            <CreateLabelDialog organizationId={project.organizationId} projectId={project.id} />
          )}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando labels...</p>}
        {isError && <p className="text-sm text-destructive">No se pudieron cargar los labels de este proyecto.</p>}
        {labels && labels.length === 0 && (
          <p className="text-sm text-muted-foreground">Todavía no hay labels en este proyecto.</p>
        )}
        {labels && labels.length > 0 && <LabelsList labels={labels} />}
      </div>
    </AppShell>
  );
}
