import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TaskEstimatedPointsFieldProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  isReadOnly: boolean;
};

export function TaskEstimatedPointsField({ value, onChange, isReadOnly }: TaskEstimatedPointsFieldProps) {
  function handleChange(rawValue: string) {
    if (rawValue.length === 0) {
      onChange(null);
      return;
    }
    onChange(Number(rawValue));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="task-detail-estimated-points">Story points</Label>
      <Input
        id="task-detail-estimated-points"
        type="number"
        min={1}
        step={1}
        value={value ?? ""}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isReadOnly}
      />
    </div>
  );
}
