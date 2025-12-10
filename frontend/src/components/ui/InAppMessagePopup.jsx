// src/components/ui/InAppMessagePopup.jsx
import { useNavigate } from "react-router-dom";

export default function InAppMessagePopup({ senderName, text, avatar, conversationId, onClose }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        onClose();
        navigate("/inbox", { state: { openChatWith: conversationId } });
      }}
      className="fixed top-4 left-1/2 -translate-x-1/2
      w-[90%] max-w-md z-99999 bg-card border border-border shadow-lg
      rounded-xl px-4 py-3 cursor-pointer flex gap-3"
    >
      <img
        src={avatar || `https://ui-avatars.com/api/?name=${senderName}`}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <div className="font-semibold text-sm">{senderName}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">{text}</div>
      </div>
    </div>
  );
}
