// src/features/chat/components/MessageInput.jsx
import { useState, useRef, useCallback } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

export default function MessageInput({ 
  onSendMessage, 
  onTypingStart, 
  onTypingStop, 
  disabled 
}) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Debounced stop typing function
  const debouncedStopTyping = useCallback(
    debounce(() => {
      onTypingStop();
      setIsTyping(false);
    }, 1000),
    [onTypingStop]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Start typing if not already typing
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    // Reset the typing timeout
    if (value.trim()) {
      debouncedStopTyping();
    } else {
      // If input is empty, stop typing immediately
      onTypingStop();
      setIsTyping(false);
      debouncedStopTyping.cancel();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
      
      // Stop typing when message is sent
      onTypingStop();
      setIsTyping(false);
      debouncedStopTyping.cancel();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Cleanup on unmount
  const handleBlur = () => {
    if (isTyping) {
      onTypingStop();
      setIsTyping(false);
      debouncedStopTyping.cancel();
    }
  };

  return (
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Attachment Button */}
        <Button type="button" variant="ghost" size="icon" disabled={disabled}>
          <Paperclip size={18} />
        </Button>

        {/* Emoji Button */}
        <Button type="button" variant="ghost" size="icon" disabled={disabled}>
          <Smile size={18} />
        </Button>

        {/* Message Input */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            placeholder="Type a message..."
            disabled={disabled}
            className="bg-background"
          />
        </div>

        {/* Voice Message */}
        <Button type="button" variant="ghost" size="icon" disabled={disabled}>
          <Mic size={18} />
        </Button>

        {/* Send Button */}
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || disabled}
          className="shrink-0"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}