import { CheckCheck, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function MessageBubble({ messages, isOwn, showAvatar, partner }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    
    // Always show time in 12-hour format (e.g., 2:30 PM)
    return messageDate.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  };

  const formatDateSeparator = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    if (messageDate.toDateString() === now.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const lastMessage = messages[messages.length - 1];
  const firstMessage = messages[0];

  return (
    <>
      {/* Date Separator - Show for first message of the day */}
      {messages[0]?.showDateSeparator && (
        <div className="flex justify-center my-6">
          <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1 rounded-full">
            {formatDateSeparator(firstMessage.createdAt)}
          </div>
        </div>
      )}
      
      <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Messages */}
        <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
          {messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`
                group relative max-w-xs lg:max-w-md px-3 py-2 rounded-2xl wrap-break-word
                ${isOwn 
                  ? 'bg-primary text-primary-foreground rounded-br-md' 
                  : 'bg-muted text-foreground rounded-bl-md'
                }
                ${messages.length === 1 ? 'rounded-2xl' : ''}
                ${messages.length > 1 && index === 0 ? 'rounded-t-md' : ''}
                ${messages.length > 1 && index === messages.length - 1 ? 'rounded-b-md' : ''}
                ${messages.length > 1 && index > 0 && index < messages.length - 1 ? 'rounded-md' : ''}
              `}
            >
              <div className="flex items-end gap-2">
                {/* Message Text */}
                <p className="text-sm flex-1">{message.text}</p>
                
                {/* Timestamp and read status - always visible inline */}
                <div className={`
                  flex items-center gap-1 shrink-0
                  ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}
                `}>
                  <span className="text-xs" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                    {formatMessageTime(message.createdAt)}
                  </span>
                  {isOwn && (
                    message.read ? (
                      <CheckCheck size={10} className="text-current shrink-0" />
                    ) : (
                      <Check size={10} className="text-current shrink-0" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spacer for alignment */}
        {showAvatar && isOwn && <div className="w-8 shrink-0" />}
      </div>
    </>
  );
}