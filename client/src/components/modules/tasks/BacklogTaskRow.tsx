import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { BacklogTask } from "./list-backlog.api";

type BacklogTaskRowProps = {
  task: BacklogTask;
};

export function BacklogTaskRow({ task }: BacklogTaskRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3">
      <span className="truncate text-sm font-medium">{task.title}</span>
      <div className="flex flex-none items-center gap-2">
        {task.estimatedPoints !== null && (
          <span className="text-xs text-muted-foreground">{task.estimatedPoints} pts</span>
        )}
        <PriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: BacklogTask["priority"] }) {
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
