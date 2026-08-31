import { useQuery } from "@tanstack/react-query";
import { listSprints } from "./list-sprints.api";

export function usePlannedSprints(organizationId: string | undefined, projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "sprints", { status: "PLANNED" }],
    queryFn: () => listSprints(organizationId as string, projectId as string, "PLANNED"),
    enabled: organizationId !== undefined && projectId !== undefined,
  });
}

export function useActiveSprint(organizationId: string | undefined, projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "sprints", { status: "ACTIVE" }],
    queryFn: () => listSprints(organizationId as string, projectId as string, "ACTIVE"),
    enabled: organizationId !== undefined && projectId !== undefined,
    select: (sprints) => sprints[0],
  });
}

export function useCompletedSprints(organizationId: string | undefined, projectId: string | undefined) {
  return useQuery({
    queryKey: ["/api/projects", projectId, "sprints", { status: "COMPLETED" }],
    queryFn: () => listSprints(organizationId as string, projectId as string, "COMPLETED"),
    enabled: organizationId !== undefined && projectId !== undefined,
  });
}
