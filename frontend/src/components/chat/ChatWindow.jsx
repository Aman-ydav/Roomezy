import React, { useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import MessageInput from "./MessageInput";
import { getConversations } from "@/utils/chatApi";
import { setConversations } from "@/features/chat/chatSlice";
import { useDispatch } from "react-redux";

export default function ChatWindow({ user, receiver, conversationId }) {
  const dispatch = useDispatch();
  const { messages, sendMessage, typing, sendTyping, stopTyping, markRead } =
    useChat(conversationId, user, receiver);

  useEffect(() => {
    markRead();
  }, [conversationId]);

  useEffect(() => {
    getConversations(user._id).then((res) => {
      dispatch(setConversations(res.data.data));
    });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg._id || Math.random()}
            className={`${
              msg.sender?.toString() === user._id?.toString()
                ? "text-right"
                : "text-left"
            } mb-3`}
          >
            <span className="px-3 py-2 bg-gray-200 rounded-xl inline-block">
              {msg.text}
            </span>
          </div>
        ))}

        {typing && (
          <div className="text-left text-sm text-gray-500">typing...</div>
        )}
      </div>

      <MessageInput
        onSend={sendMessage}
        onTyping={sendTyping}
        onStopTyping={stopTyping}
      />
    </div>
  );
}
