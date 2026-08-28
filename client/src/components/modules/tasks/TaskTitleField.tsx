import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TaskTitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
  isReadOnly: boolean;
};

export function TaskTitleField({ value, onChange, isReadOnly }: TaskTitleFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="task-detail-title">Título</Label>
      <Input
        id="task-detail-title"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isReadOnly}
      />
    </div>
  );
}
