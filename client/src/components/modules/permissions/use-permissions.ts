import { useQuery } from "@tanstack/react-query";
import { listPermissions } from "./list-permissions.api";

export function usePermissions() {
  return useQuery({
    queryKey: ["/api/permissions"],
    queryFn: listPermissions,
  });
}
