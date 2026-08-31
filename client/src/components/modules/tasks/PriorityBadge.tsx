import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { BacklogTask } from "./list-backlog.api";

type PriorityBadgeProps = {
  priority: BacklogTask["priority"];
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, variant } = describePriority(priority);
  return <Badge variant={variant}>{label}</Badge>;
}

function describePriority(priority: BacklogTask["priority"]): {
  label: string;
  variant: BadgeProps["variant"];
} {
  switch (priority) {
    case "LOW":
      return { label: "Baja", variant: "outline" };
    case "MEDIUM":
      return { label: "Media", variant: "secondary" };
    case "HIGH":
      return { label: "Alta", variant: "default" };
    case "URGENT":
      return { label: "Urgente", variant: "destructive" };
  }
}
