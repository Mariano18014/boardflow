import { z } from "zod";
import { paginationQuerySchema } from "./pagination.schema";

export const activityLogSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  actorId: z.string().uuid(),
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().uuid(),
  metadata: z.record(z.unknown()),
  createdAt: z.date(),
});

export const listActivityLogQuerySchema = paginationQuerySchema;

export type ActivityLog = z.infer<typeof activityLogSchema>;
export type ListActivityLogQuery = z.infer<typeof listActivityLogQuerySchema>;

export type ActivityLogActor = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};

export type ActivityLogEntryWithSummary = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  summary: string;
  actor: ActivityLogActor;
};
