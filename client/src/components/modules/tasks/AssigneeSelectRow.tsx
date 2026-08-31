import { Checkbox } from "@/components/ui/checkbox";
import { AssigneeAvatar } from "./AssigneeAvatar";
import type { AssigneeSummary } from "./assignee-summary";

type AssigneeSelectRowProps = {
  assignee: AssigneeSummary;
  isChecked: boolean;
  onToggle: () => void;
  isReadOnly: boolean;
};

export function AssigneeSelectRow({ assignee, isChecked, onToggle, isReadOnly }: AssigneeSelectRowProps) {
  return (
    <label className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50">
      <Checkbox checked={isChecked} onCheckedChange={onToggle} disabled={isReadOnly} />
      <AssigneeAvatar assignee={assignee} />
      <span className="truncate text-sm">{assignee.fullName}</span>
    </label>
  );
}
