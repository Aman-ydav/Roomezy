import { useState } from "react";

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
    <div className="p-3 border-t flex gap-2 bg-background">
      <input
        type="text"
        className="flex-1 px-3 py-2 text-sm border rounded-md outline-none bg-card"
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
        className="px-4 py-2 text-sm bg-primary text-white rounded-md border border-primary"
      >
        Send
      </button>
    </div>
  );
}
