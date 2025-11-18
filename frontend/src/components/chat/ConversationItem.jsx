import { cn } from "@/lib/utils";

export default function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onClick,
}) {
  const partner = conversation.participants.find(
    (p) => String(p._id) !== String(currentUserId)
  );

  const avatarUrl =
    partner?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      partner?.userName || "User"
    )}`;

  const lastText = conversation.lastMessage || "No messages yet";

  const unread = conversation.unreadCount?.[currentUserId] || 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-left border-b border-border bg-background",
        isActive && "bg-accent"
      )}
    >
      <img
        src={avatarUrl}
        alt={partner?.userName}
        className="w-10 h-10 rounded-full border border-border object-cover"
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium truncate">
            {partner?.userName || "Unknown User"}
          </p>
          {/* You can add time later if you want */}
        </div>
        <p className="text-xs text-muted-foreground truncate">{lastText}</p>
      </div>

      {unread > 0 && (
        <span className="ml-2 inline-flex items-center justify-center text-[11px] px-2 py-1 rounded-full bg-primary text-white">
          {unread}
        </span>
      )}
    </button>
  );
}
