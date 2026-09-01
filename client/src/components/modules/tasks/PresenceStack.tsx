import { AssigneeAvatar } from "./AssigneeAvatar";
import type { AssigneeSummary } from "./assignee-summary";
import type { PresentUser } from "@/modules/realtime/use-sprint-board-presence";

type PresenceStackProps = {
  presentUsers: PresentUser[];
  currentUserId: string;
};

const MAX_VISIBLE_PRESENCE_AVATARS = 4;
const OVERFLOW_THRESHOLD = 5;

export function PresenceStack({ presentUsers, currentUserId }: PresenceStackProps) {
  const otherPresentUsers = excludeCurrentUser(presentUsers, currentUserId);
  if (otherPresentUsers.length === 0) {
    return null;
  }

  const visibleUsers = buildVisibleUsers(otherPresentUsers);
  const overflowCount = otherPresentUsers.length - visibleUsers.length;

  return (
    <div className="flex -space-x-2" title="Viendo este tablero ahora">
      {visibleUsers.map((user) => (
        <AssigneeAvatar
          key={user.userId}
          assignee={mapPresentUserToAssigneeSummary(user)}
          className="border-2 border-surface"
        />
      ))}
      {overflowCount > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-muted text-[10px] font-medium">
          +{overflowCount}
        </div>
      )}
    </div>
  );
}

function excludeCurrentUser(presentUsers: PresentUser[], currentUserId: string): PresentUser[] {
  return presentUsers.filter((user) => user.userId !== currentUserId);
}

function buildVisibleUsers(otherPresentUsers: PresentUser[]): PresentUser[] {
  if (otherPresentUsers.length > OVERFLOW_THRESHOLD) {
    return otherPresentUsers.slice(0, MAX_VISIBLE_PRESENCE_AVATARS);
  }
  return otherPresentUsers;
}

function mapPresentUserToAssigneeSummary(user: PresentUser): AssigneeSummary {
  return { id: user.userId, fullName: user.fullName, avatarUrl: user.avatarUrl };
}
