import { useQuery } from "@tanstack/react-query";
import { listLabels } from "./list-labels.api";

export function useLabels(organizationId: string | undefined, projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "labels"],
    queryFn: () => listLabels(organizationId as string, projectId as string),
    enabled: organizationId !== undefined && projectId !== undefined,
  });
}
