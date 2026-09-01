import { useQuery } from "@tanstack/react-query";
import { listActivityLog } from "./list-activity-log.api";

export function useActivityLog(organizationId: string | undefined, canViewActivity: boolean) {
  return useQuery({
    queryKey: ["/api/organizations", organizationId, "activity-log"],
    queryFn: () => listActivityLog(organizationId as string),
    enabled: canViewActivity && organizationId !== undefined,
  });
}
