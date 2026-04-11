import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { formatDateTime } from "@/lib/dateFormat";

const NotificationPopup = ({ isOpen, notifications = [], isAdmin = false }) => {
  if (!isOpen) {
    return null;
  }

  const allNotificationsPath = isAdmin
    ? "/admin/announcements"
    : "/announcements";

  return (
    <div className="absolute right-0 top-12 z-50 w-[min(92vw,24rem)] rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        <Link
          to={allNotificationsPath}
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="max-h-[min(65vh,24rem)] overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : null}

        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="rounded-xl p-3 hover:bg-muted/40 transition-colors"
          >
            <p className="text-sm font-semibold text-foreground line-clamp-1">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {formatDateTime(notification.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPopup;
