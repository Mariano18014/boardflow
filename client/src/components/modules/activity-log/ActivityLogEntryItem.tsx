import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AssigneeAvatar } from "@/components/modules/tasks/AssigneeAvatar";
import type { ActivityLogEntry } from "./activity-log-entry";

type ActivityLogEntryItemProps = {
  entry: ActivityLogEntry;
};

export function ActivityLogEntryItem({ entry }: ActivityLogEntryItemProps) {
  return (
    <div className="flex items-start gap-2.5">
      <AssigneeAvatar assignee={entry.actor} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{entry.actor.fullName}</span>
          <span className="text-xs text-muted-foreground">{formatRelativeDate(entry.createdAt)}</span>
        </div>
        <p className="text-sm text-foreground">{entry.summary}</p>
      </div>
    </div>
  );
}

function formatRelativeDate(createdAt: string): string {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es });
}
