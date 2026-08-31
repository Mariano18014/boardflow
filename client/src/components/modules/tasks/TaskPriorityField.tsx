import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaskDetail } from "./get-task-detail.api";

type TaskPriorityFieldProps = {
  value: TaskDetail["priority"];
  onChange: (value: TaskDetail["priority"]) => void;
  isReadOnly: boolean;
};

const PRIORITY_OPTIONS: { value: TaskDetail["priority"]; label: string }[] = [
  { value: "LOW", label: "Baja" },
  { value: "MEDIUM", label: "Media" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];

export function TaskPriorityField({ value, onChange, isReadOnly }: TaskPriorityFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="task-detail-priority">Prioridad</Label>
      <Select value={value} onValueChange={onChange} disabled={isReadOnly}>
        <SelectTrigger id="task-detail-priority">
          <SelectValue placeholder="Elegí una prioridad" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
