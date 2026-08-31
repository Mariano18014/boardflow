import type { ProjectLabel } from "./list-labels.api";
import { LabelSwatch } from "./LabelSwatch";

type LabelsListProps = {
  labels: ProjectLabel[];
};

export function LabelsList({ labels }: LabelsListProps) {
  return (
    <div className="flex flex-col gap-2">
      {labels.map((label) => (
        <div
          key={label.id}
          className="flex items-center gap-3 rounded-md border border-border bg-surface p-3"
        >
          <LabelSwatch color={label.color} />
          <span className="text-sm font-medium">{label.name}</span>
        </div>
      ))}
    </div>
  );
}
