import { z } from "zod";
import { MEMBERSHIP_STATUS } from "../types/enums";

export const membershipSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  roleId: z.string().uuid(),
  status: z.enum(MEMBERSHIP_STATUS),
  invitedBy: z.string().uuid().nullable(),
  joinedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateMembershipRoleSchema = z.object({
  roleId: z.string().uuid(),
});

export type Membership = z.infer<typeof membershipSchema>;
export type UpdateMembershipRoleInput = z.infer<typeof updateMembershipRoleSchema>;
