import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNotifications } from "./use-notifications";
import { NotificationListItem } from "./NotificationListItem";

export function NotificationList() {
  const { data: notifications, isLoading } = useNotifications(false);

  return (
    <>
      <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {isLoading && <p className="px-2 py-2 text-sm text-muted-foreground">Cargando...</p>}
      {notifications && notifications.length === 0 && (
        <p className="px-2 py-2 text-sm text-muted-foreground">Todavía no tenés notificaciones.</p>
      )}
      {notifications?.map((notification) => (
        <NotificationListItem key={notification.id} notification={notification} />
      ))}
    </>
  );
}
