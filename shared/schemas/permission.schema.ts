import { z } from "zod";

export const permissionSchema = z.object({
  id: z.string().uuid(),
  resource: z.string().min(1),
  action: z.string().min(1),
  key: z.string().min(1),
});

export type Permission = z.infer<typeof permissionSchema>;
