import { useEffect, useState } from "react";
import { Bell, Trash2, CheckCheck, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInterceptor";
import { socket } from "@/socket/socket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60)    return "just now";
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

const TYPE_COLORS = {
  new_message:  "bg-blue-500",
  kyc_verified: "bg-green-500",
  credits_added:"bg-amber-500",
};

export default function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [open,          setOpen]          = useState(false);

  async function fetchNotifications() {
    try {
      const { data } = await axiosInstance.get("/notifications");
      setNotifications(data.data.notifications || []);
      setUnreadCount(data.data.unreadCount || 0);
    } catch {}
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => fetchNotifications();
    socket.on("new-notification", handler);
    return () => socket.off("new-notification", handler);
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  async function handleMarkAllRead() {
    try {
      await axiosInstance.patch("/notifications/read-all");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  }

  async function handleMarkOneRead(e, id) {
    e.stopPropagation();
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  }

  async function handleDeleteOne(e, id, wasUnread) {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  }

  async function handleDeleteAll() {
    try {
      await axiosInstance.delete("/notifications");
      setNotifications([]);
      setUnreadCount(0);
    } catch {}
  }

  async function handleClickNotification(n) {
    if (!n.read) {
      try {
        await axiosInstance.patch(`/notifications/${n._id}/read`);
        setNotifications((prev) =>
          prev.map((x) => x._id === n._id ? { ...x, read: true } : x)
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {}
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-muted transition-colors group"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 bg-card border border-border shadow-xl rounded-xl mt-2 overflow-hidden"
      >
        {/* ── Pinned header ── */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive font-medium transition-colors"
                title="Delete all"
              >
                <Trash2 size={13} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* ── Scrollable list ── */}
        <div className="overflow-y-auto max-h-[360px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
              <Bell size={28} className="opacity-20" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleClickNotification(n)}
                  className={`group relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Unread dot / type color */}
                  <div className="shrink-0 mt-1">
                    {!n.read ? (
                      <span className={`block h-2 w-2 rounded-full ${TYPE_COLORS[n.type] || "bg-primary"}`} />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-12">
                    <p className={`text-sm leading-tight ${!n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Action buttons — shown on hover */}
                  <div className="absolute right-3 top-3 hidden group-hover:flex items-center gap-1">
                    {!n.read && (
                      <button
                        onClick={(e) => handleMarkOneRead(e, n._id)}
                        className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                        title="Mark as read"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteOne(e, n._id, !n.read)}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
