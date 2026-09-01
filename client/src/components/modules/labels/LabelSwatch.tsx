type LabelSwatchProps = {
  color: string;
};

// Small color square used both in the label management list (HU-36) and,
// later, wherever a task shows its assigned labels (HU-37) — kept as its own
// component instead of inlined so both places render the swatch identically.
export function LabelSwatch({ color }: LabelSwatchProps) {
  return (
    <span
      className="inline-block h-4 w-4 rounded border border-border"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}
