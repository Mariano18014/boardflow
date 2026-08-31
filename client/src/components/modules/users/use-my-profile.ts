import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "./get-my-profile.api";

export function useMyProfile() {
  return useQuery({
    queryKey: ["/api/users/me"],
    queryFn: getMyProfile,
  });
}
