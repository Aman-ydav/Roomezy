import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { createConversation } from "@/utils/chatApi";
import { ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const { id: receiverId } = useParams();
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [conversationId, setConversationId] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!user) return;

      if (String(user._id) === String(receiverId)) {
        setError("You cannot chat with yourself.");
        return;
      }

      try {
        const res = await createConversation({
          senderId: user._id,
          receiverId,
        });

        const c = res.data.data;
        setConversationId(c._id);

        const partnerObj = c.participants.find(
          (p) => String(p._id) !== String(user._id)
        );
        setReceiver(partnerObj);
      } catch (err) {
        setError("Unable to open chat.");
      }
    }

    load();
  }, [receiverId, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Please login to use chat.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm font-semibold">Chat</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!conversationId || !receiver)
    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft size={18} />
          </button>
          <p className="text-sm font-semibold">Chat</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Loading chat...
        </div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="mr-2 md:hidden">
          <ArrowLeft size={18} />
        </button>
        <img
          src={
            receiver.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              receiver.userName || "User"
            )}`
          }
          className="w-10 h-10 rounded-full border border-border object-cover"
          alt={receiver.userName}
        />
        <div>
          <p className="text-sm font-semibold">{receiver.userName}</p>
          <p className="text-xs text-green-600">Online</p>
        </div>
      </div>

      <ChatWindow
        user={user}
        receiver={receiver}
        conversationId={conversationId}
      />
    </div>
  );
}
