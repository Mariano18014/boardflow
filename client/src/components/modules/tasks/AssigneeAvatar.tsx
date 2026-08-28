import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AssigneeSummary } from "./assignee-summary";

type AssigneeAvatarProps = {
  assignee: AssigneeSummary;
  className?: string;
};

export function AssigneeAvatar({ assignee, className }: AssigneeAvatarProps) {
  return (
    <Avatar className={cn("h-6 w-6", className)} title={assignee.fullName}>
      {assignee.avatarUrl && <AvatarImage src={assignee.avatarUrl} alt={assignee.fullName} />}
      <AvatarFallback className="text-[10px]">{buildInitials(assignee.fullName)}</AvatarFallback>
    </Avatar>
  );
}

function buildInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter((word) => word.length > 0);
  const initials = words.slice(0, 2).map((word) => word.charAt(0).toUpperCase());
  return initials.join("");
}
