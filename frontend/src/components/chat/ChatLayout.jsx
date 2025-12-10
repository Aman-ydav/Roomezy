// src/components/chat/ChatLayout.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { setCurrentChatId } from "@/features/chat/chatSlice";

export default function ChatLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const user = useSelector((s) => s.auth.user);
  const conversations = useSelector((s) => s.chat.conversations);

  const { state } = useLocation();
  const openChatWith = state?.openChatWith;

  useEffect(() => {
    if (!openChatWith || conversations.length === 0) return;

    // 1. Try treat openChatWith as conversationId
    let target =
      conversations.find(
        (c) => String(c._id) === String(openChatWith)
      ) || null;

    // 2. If not found, treat it as userId (from PostDetails)
    if (!target) {
      target = conversations.find((c) =>
        c.participants?.some(
          (p) => String(p._id) === String(openChatWith)
        )
      );
    }

    if (target) {
      setSelectedConversation(target);
      dispatch(setCurrentChatId(target._id));

      // Clear state so Back button doesn’t loop
      navigate("/inbox", { replace: true });
    }
  }, [openChatWith, conversations, dispatch, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageCircle
            size={50}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h3 className="text-2xl font-semibold mb-4">Please login to chat</h3>
          <p className="text-muted-foreground text-lg">
            Sign in to start messaging with other users
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden bg-background">
      {/* Conversation List */}
      <div
        className={`${
          selectedConversation ? "hidden lg:flex" : "flex"
        } w-full lg:w-96 flex-col border-r border-border overflow-y-auto`}
      >
        <ConversationList
          onSelectConversation={(c) => {
            setSelectedConversation(c);
            dispatch(setCurrentChatId(c._id));
          }}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Chat Window */}
      {selectedConversation && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          <ChatWindow
            conversation={selectedConversation}
            onBack={() => {
              setSelectedConversation(null);
              dispatch(setCurrentChatId(null));
            }}
            currentUser={user}
          />
        </div>
      )}
    </div>
  );
}
