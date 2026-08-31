import type { LabelSummary } from "./label-summary";

type LabelChipProps = {
  label: LabelSummary;
};

// A colored pill showing a label's name, using its own color as a tinted
// background so it stays readable regardless of the label's chosen hue.
export function LabelChip({ label }: LabelChipProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: `${label.color}26`, color: label.color }}
    >
      {label.name}
    </span>
  );
}
