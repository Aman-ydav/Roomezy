import React, { useState } from "react";

export default function MessageInput({ onSend, onTyping, onStopTyping }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    onSend(text);
    setText("");
    onStopTyping();
  };

  return (
    <div className="p-4 border-t flex gap-3">
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onTyping();
        }}
        onBlur={onStopTyping}
        placeholder="Type a message..."
      />

      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}
