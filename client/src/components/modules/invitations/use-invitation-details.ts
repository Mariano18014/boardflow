import { useQuery } from "@tanstack/react-query";
import { getInvitationDetails } from "./get-invitation-details.api";

export function useInvitationDetails(token: string) {
  return useQuery({
    queryKey: ["/api/invitations", token],
    queryFn: () => getInvitationDetails(token),
    enabled: token.length > 0,
    retry: false,
  });
}
