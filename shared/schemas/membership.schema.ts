import { z } from "zod";
import { MEMBERSHIP_STATUS, type MembershipStatus } from "../types/enums";
import { paginationQuerySchema } from "./pagination.schema";

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

export const listOrganizationMembersQuerySchema = paginationQuerySchema;

export type Membership = z.infer<typeof membershipSchema>;
export type UpdateMembershipRoleInput = z.infer<typeof updateMembershipRoleSchema>;
export type ListOrganizationMembersQuery = z.infer<typeof listOrganizationMembersQuerySchema>;

export type OrganizationMemberListItem = {
  type: "member" | "invitation";
  id: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  roleId: string;
  roleName: string;
  status: MembershipStatus | "PENDING";
  sortDate: Date;
};
