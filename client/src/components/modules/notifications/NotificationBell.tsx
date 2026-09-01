import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotifications } from "./use-notifications";
import { NotificationList } from "./NotificationList";

export function NotificationBell() {
  const { data: unreadNotifications } = useNotifications(true);
  const unreadCount = unreadNotifications?.length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <NotificationList />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
