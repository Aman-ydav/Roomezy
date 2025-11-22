// src/features/chat/components/MessageInput.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmojiPicker from "emoji-picker-react";
import { debounce } from "lodash";

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled,
}) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Debounced stop typing
  const debouncedStopTyping = useCallback(
    debounce(() => {
      onTypingStop();
      setIsTyping(false);
    }, 1000),
    []
  );

  // --------------- Handle Input ------------------
  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Typing logic
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    if (value.trim()) {
      debouncedStopTyping();
    } else {
      onTypingStop();
      setIsTyping(false);
      debouncedStopTyping.cancel();
    }
  };

  // --------------- Send Message ------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage("");

    // Stop typing
    onTypingStop();
    setIsTyping(false);
    debouncedStopTyping.cancel();
  };

  // --------------- Enter to Send ------------------
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // --------------- Emoji Insert at Cursor ------------------
  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;

    if (!textareaRef.current) return;

    const cursorPos = textareaRef.current.selectionStart;

    const before = message.substring(0, cursorPos);
    const after = message.substring(cursorPos);

    const newMessage = before + emoji + after;
    setMessage(newMessage);

    // Restore cursor
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart =
        textareaRef.current.selectionEnd =
        cursorPos + emoji.length;
    }, 0);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="border-t border-border bg-card p-3 relative">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">

        {/* Emoji Toggle */}
        <div className="relative" ref={emojiPickerRef}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            disabled={disabled}
          >
            <Smile size={22} />
          </Button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50 shadow-lg border border-border rounded-xl">
              <EmojiPicker onEmojiClick={handleEmojiClick} height={350} />
            </div>
          )}
        </div>

        {/* Textarea Message Box */}
        <textarea
          ref={textareaRef}
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm  
                     focus:ring-2 focus:ring-primary resize-none scrollbar-none"
          rows={1}
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="rounded-full bg-primary hover:bg-primary/90"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
