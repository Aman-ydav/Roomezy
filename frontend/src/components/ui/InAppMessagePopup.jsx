// src/components/ui/InAppMessagePopup.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function InAppMessagePopup({
  senderName,
  text,
  avatar,
  conversationId,
  onClose,
}) {
  const navigate = useNavigate();
  const popupRef = useRef(null);

  // Auto hide in 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // swipe/drag hide
  useEffect(() => {
    let startY = null;

    function onTouchStart(e) {
      startY = e.touches[0].clientY;
    }

    function onTouchMove(e) {
      if (startY === null) return;
      const diff = e.touches[0].clientY - startY;
      if (diff < -30) {
        onClose();
      }
    }

    const node = popupRef.current;
    if (node) {
      node.addEventListener("touchstart", onTouchStart);
      node.addEventListener("touchmove", onTouchMove);
    }
    return () => {
      if (node) {
        node.removeEventListener("touchstart", onTouchStart);
        node.removeEventListener("touchmove", onTouchMove);
      }
    };
  }, []);

  return (
    <div
      ref={popupRef}
      onClick={() => {
        onClose();
        navigate("/inbox", { state: { openChatWith: conversationId } });
      }}
      className="fixed top-4 left-1/2 -translate-x-1/2
      w-[90%] max-w-md z-99999
      bg-card border border-border shadow-lg rounded-xl
      px-4 py-3 cursor-pointer flex gap-3 
      transition-transform duration-200"
    >
      <img
        src={avatar || `https://ui-avatars.com/api/?name=${senderName}`}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        <div className="font-semibold text-sm">{senderName}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">
          {text}
        </div>
      </div>
    </div>
  );
}
