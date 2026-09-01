type LabelSwatchProps = {
  color: string;
};

export function LabelSwatch({ color }: LabelSwatchProps) {
  return (
    <span
      className="inline-block h-4 w-4 rounded border border-border"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}
