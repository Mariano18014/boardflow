import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type TaskDescriptionFieldProps = {
  value: string;
  onChange: (value: string) => void;
  isReadOnly: boolean;
};

export function TaskDescriptionField({ value, onChange, isReadOnly }: TaskDescriptionFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="task-detail-description">Descripción</Label>
      <Textarea
        id="task-detail-description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isReadOnly}
        placeholder="Sin descripción"
      />
    </div>
  );
}
