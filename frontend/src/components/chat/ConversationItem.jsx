// src/features/chat/components/ConversationItem.jsx
import { motion } from "framer-motion";
import { useUserStatus } from "@/hooks/useUserStatus";

export default function ConversationItem({
  conversation,
  currentUserId,
  isSelected,
  onClick,
}) {
  // partner user
  const partner = conversation.participants.find(
    (p) => p._id !== currentUserId
  );

  // last message is always a STRING
  const lastMessageRaw = conversation.lastMessage;

  // sender of last msg
  const isLastMessageFromMe =
    conversation.lastMessageSender === currentUserId;

  // unread messages for current user
  const unreadCount = conversation.unreadCount?.[currentUserId] || 0;

  // online status
  const isOnline = useUserStatus(partner?._id);

  // FIX: Use updatedAt for last message time
  const lastMessageTime = conversation.updatedAt;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: "var(--muted)" }}
      className={`
        flex items-center p-4 border-b border-border cursor-pointer transition-colors
        ${isSelected ? "bg-muted" : "hover:bg-muted/50"}
        ${unreadCount > 0 ? "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-primary" : ""}
      `}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative shrink-0 mr-3">
        <img
          src={
            partner?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              partner?.userName || "User"
            )}&background=primary&color=fff`
          }
          className="w-12 h-12 rounded-full border object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {/* Top row: Name + Time */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm truncate">
            {partner?.userName || "Unknown User"}
          </h3>

          <span className="text-xs text-muted-foreground">
            {formatTime(lastMessageTime)}
          </span>
        </div>

      
      </div>

      {/* UNREAD BADGE */}
      {unreadCount > 0 && (
        <div className="shrink-0 ml-2">
          <span className="bg-primary text-primary-foreground text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-2">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </div>
      )}
    </motion.div>
  );
}
