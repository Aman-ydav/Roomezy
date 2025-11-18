import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import MessageInput from "./MessageInput";

export default function ChatWindow({ user, receiver, conversationId }) {
  const {
    messages,
    sendMessage,
    typing,
    sendTyping,
    stopTyping,
    markRead,
    getSenderId,
  } = useChat(conversationId, user, receiver);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      markRead();
    }
  }, [conversationId, markRead]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
   <div className="h-full flex flex-col bg-background border-l overflow-hidden">

      {/* Messages area */}
     <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">

        {messages.map((msg) => {
          const senderId = getSenderId(msg);
          const isMe = String(senderId) === String(user._id);

          return (
            <div
              key={msg._id || `${senderId}-${msg.createdAt}-${Math.random()}`}
              className={`flex mb-1 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 text-sm rounded-lg border ${
                  isMe
                    ? "bg-primary text-white border-primary"
                    : "bg-card text-foreground border-border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="text-xs text-muted-foreground mt-2">
            {receiver?.userName || "User"} is typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        onTyping={sendTyping}
        onStopTyping={stopTyping}
      />
    </div>
  );
}
