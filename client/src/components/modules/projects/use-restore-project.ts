import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { restoreProject as sendRestoreProjectRequest } from "./restore-project.api";
import { ProjectApiError } from "./project-api-error";

export function useRestoreProject(organizationId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (projectId: string) => sendRestoreProjectRequest(organizationId, projectId),
    onSuccess: () => {
      invalidateProjectsList(queryClient, organizationId);
      toast({ title: "Proyecto restaurado", description: "Ya aparece de nuevo entre los activos." });
    },
    onError: (error) => {
      notifyRestoreProjectFailed(error, toast);
    },
  });

  return { restoreProject: mutation.mutate, isPending: mutation.isPending };
}

function invalidateProjectsList(queryClient: QueryClient, organizationId: string) {
  queryClient.invalidateQueries({ queryKey: ["/api/organizations", organizationId, "projects"] });
}

function notifyRestoreProjectFailed(error: unknown, toast: ReturnType<typeof useToast>["toast"]) {
  const message = error instanceof ProjectApiError ? error.message : "No se pudo restaurar el proyecto.";
  toast({
    variant: "destructive",
    title: "No se pudo restaurar el proyecto",
    description: message,
  });
}
