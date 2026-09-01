import { Checkbox } from "@/components/ui/checkbox";
import { LabelSwatch } from "@/components/modules/labels/LabelSwatch";
import type { ProjectLabel } from "@/components/modules/labels/list-labels.api";

type LabelSelectRowProps = {
  label: ProjectLabel;
  isChecked: boolean;
  onToggle: () => void;
  isReadOnly: boolean;
};

export function LabelSelectRow({ label, isChecked, onToggle, isReadOnly }: LabelSelectRowProps) {
  return (
    <label className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50">
      <Checkbox checked={isChecked} onCheckedChange={onToggle} disabled={isReadOnly} />
      <LabelSwatch color={label.color} />
      <span className="truncate text-sm">{label.name}</span>
    </label>
  );
}
