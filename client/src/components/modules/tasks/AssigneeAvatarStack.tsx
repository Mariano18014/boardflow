import { AssigneeAvatar } from "./AssigneeAvatar";
import type { AssigneeSummary } from "./assignee-summary";

type AssigneeAvatarStackProps = {
  assignees: AssigneeSummary[];
};

const MAX_VISIBLE_AVATARS = 3;

export function AssigneeAvatarStack({ assignees }: AssigneeAvatarStackProps) {
  if (assignees.length === 0) {
    return null;
  }

  const visibleAssignees = assignees.slice(0, MAX_VISIBLE_AVATARS);
  const overflowCount = assignees.length - visibleAssignees.length;

  return (
    <div className="flex -space-x-2">
      {visibleAssignees.map((assignee) => (
        <AssigneeAvatar key={assignee.id} assignee={assignee} className="border-2 border-surface" />
      ))}
      {overflowCount > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-muted text-[10px] font-medium">
          +{overflowCount}
        </div>
      )}
    </div>
  );
}
