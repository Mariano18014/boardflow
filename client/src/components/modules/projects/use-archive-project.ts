import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { archiveProject as sendArchiveProjectRequest } from "./archive-project.api";
import { ProjectApiError } from "./project-api-error";

export function useArchiveProject(organizationId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (projectId: string) => sendArchiveProjectRequest(organizationId, projectId),
    onSuccess: () => {
      invalidateProjectsList(queryClient, organizationId);
      toast({
        title: "Proyecto archivado",
        description: "Podés restaurarlo cuando quieras desde la sección de archivados.",
      });
    },
    onError: (error) => {
      notifyArchiveProjectFailed(error, toast);
    },
  });

  return { archiveProject: mutation.mutate, isPending: mutation.isPending };
}

function invalidateProjectsList(queryClient: QueryClient, organizationId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/organizations", organizationId, "projects"] });
}

function notifyArchiveProjectFailed(error: unknown, toast: ReturnType<typeof useToast>["toast"]) {
  const message = error instanceof ProjectApiError ? error.message : "No se pudo archivar el proyecto.";
  toast({
    variant: "destructive",
    title: "No se pudo archivar el proyecto",
    description: message,
  });
}
