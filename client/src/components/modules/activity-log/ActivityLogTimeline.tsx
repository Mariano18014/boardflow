import type { ActivityLogEntry } from "./activity-log-entry";
import { ActivityLogEntryItem } from "./ActivityLogEntryItem";

type ActivityLogTimelineProps = {
  entries: ActivityLogEntry[];
};

export function ActivityLogTimeline({ entries }: ActivityLogTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay actividad registrada.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <ActivityLogEntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
