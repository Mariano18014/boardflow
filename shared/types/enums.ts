

export const USER_STATUS = ["ACTIVE", "PENDING_VERIFICATION", "SUSPENDED"] as const;
export type UserStatus = (typeof USER_STATUS)[number];

export const PLAN_TYPE = ["FREE", "PRO", "ENTERPRISE"] as const;
export type PlanType = (typeof PLAN_TYPE)[number];

export const MEMBERSHIP_STATUS = ["ACTIVE", "INVITED", "SUSPENDED"] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUS)[number];

export const SPRINT_STATUS = ["PLANNED", "ACTIVE", "COMPLETED"] as const;
export type SprintStatus = (typeof SPRINT_STATUS)[number];

export const TASK_PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type TaskPriority = (typeof TASK_PRIORITY)[number];

export const INVITATION_STATUS = ["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"] as const;
export type InvitationStatus = (typeof INVITATION_STATUS)[number];
