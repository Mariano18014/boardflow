import { useQuery } from "@tanstack/react-query";
import { listBoards } from "./list-boards.api";

export function useBoards(organizationId: string | undefined, projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "boards"],
    queryFn: () => listBoards(organizationId as string, projectId as string),
    enabled: organizationId !== undefined && projectId !== undefined,
  });
}
