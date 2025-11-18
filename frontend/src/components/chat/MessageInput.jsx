import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ onSend, onTyping, onStopTyping }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
    onStopTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm flex gap-3 items-center">
      <input
        type="text"
        className="flex-1 px-4 py-3 text-sm border border-border rounded-lg outline-none bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onTyping();
        }}
        onBlur={onStopTyping}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="px-4 py-3 bg-primary text-white rounded-lg border border-primary hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
        aria-label="Send message"
      >
        <Send size={18} />
        <span className="hidden sm:inline text-sm font-medium">Send</span>
      </button>
    </div>
  );
}
