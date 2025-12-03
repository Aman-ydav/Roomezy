import { CheckCheck, Check, Trash2, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";

export default function MessageBubble({
  messages,
  isOwn,
  currentUserId,
  onDeleteForMe,
  onDeleteForEveryone,
}) {
  const [menuMessage, setMenuMessage] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const openMenu = (message, x, y) => {
    const popupWidth = 180;
    const popupHeight = isOwn ? 100 : 70;

    const adjustedX =
      x + popupWidth > window.innerWidth
        ? window.innerWidth - popupWidth - 10
        : x;

    const adjustedY =
      y + popupHeight > window.innerHeight
        ? window.innerHeight - popupHeight - 10
        : y;

    setMenuPosition({ x: adjustedX, y: adjustedY });
    setMenuMessage(message);
  };

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    openMenu(message, e.clientX, e.clientY);
  };

  const handleMenuButton = (message, bubbleRef) => {
    if (!bubbleRef) return;

    const rect = bubbleRef.getBoundingClientRect();
    openMenu(message, rect.right - 20, rect.top + 20);
  };

  let longPressTimer;
  const handleLongPressStart = (message) => {
    longPressTimer = setTimeout(() => openMenu(message, 120, 200), 500);
  };
  const handleLongPressEnd = () => clearTimeout(longPressTimer);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.classList.contains("msg-menu-btn")) {
        setMenuMessage(null);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const deleteForMe = () => {
    onDeleteForMe(menuMessage);
    setMenuMessage(null);
  };

  const deleteForEveryone = () => {
    onDeleteForEveryone(menuMessage);
    setMenuMessage(null);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
          {messages.map((message) => {
            if (message.deletedFor?.includes(currentUserId)) return null;

            if (message.deletedForEveryone) {
              return (
                <div
                  key={message._id}
                  className="text-xs italic text-muted-foreground px-3 py-2"
                >
                  This message was deleted
                </div>
              );
            }

            const bubbleClass = `
              group relative max-w-xs lg:max-w-md px-3 py-2 rounded-2xl
              ${isOwn ? "bg-primary text-white" : "bg-muted text-foreground"}
            `;

            let bubbleRef = null;

            return (
              <div
                key={message._id}
                className={bubbleClass}
                ref={(el) => (bubbleRef = el)}
                onContextMenu={(e) => handleContextMenu(e, message)}
                onTouchStart={() => handleLongPressStart(message)}
                onTouchEnd={handleLongPressEnd}
              >
                <div className="flex items-end w-full gap-2">
                  <p className="text-sm wrap-break-word">{message.text}</p>

                  <div className={`flex items-center gap-1 ml-auto text-[9px] ${
                    isOwn ? "text-white/80" : "text-muted-foreground"
                  }`}>
                    {formatTime(message.createdAt)}
                    {isOwn &&
                      (message.read ? (
                        <CheckCheck size={12} />
                      ) : (
                        <Check size={12} />
                      ))}
                  </div>

                  <button
                    className="msg-menu-btn opacity-0 group-hover:opacity-100 transition bg-transparent mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuButton(message, bubbleRef);
                    }}
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MENU POPUP */}
      {menuMessage && (
        <div
          className="fixed z-50 bg-card shadow-xl rounded-lg border border-border p-2 text-sm animate-in fade-in zoom-in"
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
            width: 180,
          }}
          onMouseEnter={() => {
            if (window.closePopupTimer) {
              clearTimeout(window.closePopupTimer);
              window.closePopupTimer = null;
            }
          }}
          onMouseLeave={() => {
            window.closePopupTimer = setTimeout(() => {
              setMenuMessage(null);
            }, 500);
          }}
        >
          <button
            onClick={deleteForMe}
            className="flex items-center gap-2 px-1 py-2 hover:bg-muted w-full rounded-md"
          >
            <Trash2 size={15} /> Delete for me
          </button>

          {isOwn && menuMessage?.canDeleteForEveryone && (
            <button
              onClick={deleteForEveryone}
              className="flex items-center gap-2 px-1 py-2 hover:bg-muted w-full rounded-md text-red-500"
            >
              <Trash2 size={15} /> Delete for everyone
            </button>
          )}
        </div>
      )}
    </>
  );
}
