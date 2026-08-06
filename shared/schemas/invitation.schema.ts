import { z } from "zod";
import { INVITATION_STATUS } from "../types/enums";

export const invitationSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  email: z.string().email(),
  roleId: z.string().uuid(),
  token: z.string(),
  status: z.enum(INVITATION_STATUS),
  invitedBy: z.string().uuid(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const createInvitationSchema = invitationSchema.pick({ email: true, roleId: true });

export const acceptInvitationSchema = z.object({
  token: z.string(),
});

export type Invitation = z.infer<typeof invitationSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
