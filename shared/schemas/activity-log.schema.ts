import { z } from "zod";

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

export type ActivityLog = z.infer<typeof activityLogSchema>;
