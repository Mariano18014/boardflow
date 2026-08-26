import { useQuery } from "@tanstack/react-query";
import { getProject } from "./get-project.api";

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["/api/projects", projectId],
    queryFn: () => getProject(projectId),
  });
}
