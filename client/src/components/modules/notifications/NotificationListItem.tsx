import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useLocation } from "wouter";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMarkNotificationRead } from "./use-mark-notification-read";
import type { NotificationEntry, TaskAssignedPayload } from "./notification-entry";

type NotificationListItemProps = {
  notification: NotificationEntry;
};

export function NotificationListItem({ notification }: NotificationListItemProps) {
  const { markNotificationRead } = useMarkNotificationRead();
  const [, navigate] = useLocation();

  function handleClick() {
    if (notification.readAt === null) {
      markNotificationRead(notification.id);
    }
    navigateToNotificationTarget(notification, navigate);
  }

  return (
    <DropdownMenuItem onClick={handleClick} className="flex-col items-start gap-0.5 py-2">
      <div className="flex w-full items-start gap-2">
        {notification.readAt === null && (
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        )}
        <p className="flex-1 whitespace-normal text-sm text-foreground">{buildNotificationText(notification)}</p>
      </div>
      <span className="pl-3.5 text-xs text-muted-foreground">{formatRelativeDate(notification.createdAt)}</span>
    </DropdownMenuItem>
  );
}

function buildNotificationText(notification: NotificationEntry): string {
  if (notification.type === "task_assigned") {
    const payload = notification.payload as unknown as TaskAssignedPayload;
    return `${payload.assignedByName} te asignó la tarea "${payload.taskTitle}".`;
  }
  return "Tenés una notificación nueva.";
}

function navigateToNotificationTarget(notification: NotificationEntry, navigate: (path: string) => void) {
  if (notification.type === "task_assigned") {
    const payload = notification.payload as unknown as TaskAssignedPayload;
    navigate(`/projects/${payload.projectId}/backlog?taskId=${payload.taskId}`);
  }
}

function formatRelativeDate(createdAt: string): string {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: es });
}
