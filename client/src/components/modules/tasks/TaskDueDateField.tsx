import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-time-picker";

type TaskDueDateFieldProps = {
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  isReadOnly: boolean;
};

export function TaskDueDateField({ value, onChange, isReadOnly }: TaskDueDateFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Fecha límite</Label>
      <DateTimePicker date={value} setDate={onChange} showTime={false} disabled={isReadOnly} />
    </div>
  );
}
