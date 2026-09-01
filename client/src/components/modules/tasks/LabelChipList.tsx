import type { LabelSummary } from "./label-summary";
import { LabelChip } from "./LabelChip";

type LabelChipListProps = {
  labels: LabelSummary[];
};

export function LabelChipList({ labels }: LabelChipListProps) {
  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {labels.map((label) => (
        <LabelChip key={label.id} label={label} />
      ))}
    </div>
  );
}
