// src/features/chat/components/MessageList.jsx
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, currentUserId, getSenderId, partner }) {
  const listRef = useRef(null);

  // Add date separators to messages
  const messagesWithDateSeparators = messages.map((message, index) => {
    const currentDate = new Date(message.createdAt).toDateString();
    const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
    
    return {
      ...message,
      showDateSeparator: currentDate !== prevDate
    };
  });

  const groupedMessages = messagesWithDateSeparators.reduce((groups, message) => {
    const senderId = getSenderId(message);
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup && lastGroup.senderId === senderId) {
      // Check if messages are within 5 minutes of each other
      const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];
      const timeDiff = new Date(message.createdAt) - new Date(lastMessage.createdAt);
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff < 5) {
        lastGroup.messages.push(message);
      } else {
        // Start new group if more than 5 minutes apart
        groups.push({
          senderId,
          messages: [message],
          isOwn: String(senderId) === String(currentUserId)
        });
      }
    } else {
      groups.push({
        senderId,
        messages: [message],
        isOwn: String(senderId) === String(currentUserId)
      });
    }
    
    return groups;
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [messages]);

  return (
    <div 
      ref={listRef}
      className="h-full overflow-y-auto p-4 space-y-1 scroll-smooth"
    >
      {groupedMessages.length === 0 && !loading ? (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
            <p className="text-sm text-muted-foreground">
              Send a message to get the conversation started
            </p>
          </div>
        </div>
      ) : (
        groupedMessages.map((group, index) => (
          <MessageBubble
            key={group.messages[0]._id || index}
            messages={group.messages}
            isOwn={group.isOwn}
            partner={partner}
            showAvatar={index === groupedMessages.length - 1 || 
              groupedMessages[index + 1]?.senderId !== group.senderId}
          />
        ))
      )}
    </div>
  );
}