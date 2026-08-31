import { Label } from "@/components/ui/label";
import type { ProjectLabel } from "@/components/modules/labels/list-labels.api";
import { LabelSelectRow } from "./LabelSelectRow";

type LabelSelectProps = {
  labels: ProjectLabel[];
  selectedLabelIds: string[];
  onChange: (labelIds: string[]) => void;
  isReadOnly: boolean;
};

export function LabelSelect({ labels, selectedLabelIds, onChange, isReadOnly }: LabelSelectProps) {
  function toggleLabel(labelId: string) {
    if (selectedLabelIds.includes(labelId)) {
      onChange(selectedLabelIds.filter((id) => id !== labelId));
    } else {
      onChange([...selectedLabelIds, labelId]);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Labels</Label>
      <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-md border border-border p-1.5">
        {labels.length === 0 && (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">Todavía no hay labels en este proyecto.</p>
        )}
        {labels.map((label) => (
          <LabelSelectRow
            key={label.id}
            label={label}
            isChecked={selectedLabelIds.includes(label.id)}
            onToggle={() => toggleLabel(label.id)}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>
    </div>
  );
}
