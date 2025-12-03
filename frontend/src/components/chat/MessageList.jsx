// src/features/chat/components/MessageList.jsx
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  messages,
  currentUserId,
  getSenderId,
  partner,
  loading,
  deleteForMe,
  deleteForEveryone,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "auto" });
    }, 50);
  }, [messages]);

  const withDates = messages.map((m, i) => ({
    ...m,
    showDateSeparator:
      i === 0 ||
      new Date(m.createdAt).toDateString() !==
        new Date(messages[i - 1].createdAt).toDateString(),
  }));

  const grouped = withDates.reduce((acc, msg) => {
    const sender = getSenderId(msg);

    const last = acc[acc.length - 1];
    if (
      last &&
      last.senderId === sender &&
      new Date(msg.createdAt) - new Date(last.messages.at(-1).createdAt) <
        5 * 60 * 1000
    ) {
      last.messages.push(msg);
    } else {
      acc.push({
        senderId: sender,
        messages: [msg],
        isOwn: String(sender) === String(currentUserId),
      });
    }
    return acc;
  }, []);

  return (
    <div className="p-4 space-y-1">
      {loading ? (
        <div className="flex items-center justify-center h-full">Loading...</div>
      ) : grouped.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          Start a conversation 👋
        </div>
      ) : (
        grouped.map((g, i) => (
          <MessageBubble
            key={i}
            messages={g.messages}
            isOwn={g.isOwn}
            currentUserId={currentUserId}
            onDeleteForMe={deleteForMe}
            onDeleteForEveryone={deleteForEveryone}
          />
        ))
      )}

      <div ref={scrollRef} />
    </div>
  );
}
