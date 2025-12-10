// src/components/ChatLayout.jsx
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

  // When page loads and navigation state requests opening a chat (conversationId or userId)
  useEffect(() => {
    if (!openChatWith || conversations.length === 0) return;

    // Try treat openChatWith as conversationId first
    let target =
      conversations.find((c) => String(c._id) === String(openChatWith)) || null;

    // If not found, treat it as a userId (find conversation that includes that user)
    if (!target) {
      target = conversations.find((c) =>
        c.participants?.some((p) => String(p._id) === String(openChatWith))
      );
    }

    if (target) {
      setSelectedConversation(target);
      dispatch(setCurrentChatId(target._id));

      // Replace the history state to avoid navigation loops (keeps URL /inbox)
      navigate("/inbox", { replace: true });
    }
  }, [openChatWith, conversations, dispatch, navigate]);

  // Keep browser history behavior sane on mobile/back button:
  // - When opening a chat we push a history entry.
  // - When back button (popstate) happens and a chat is open, close the chat only.
  useEffect(() => {
    const handlePopState = (event) => {
      // If a chat is open, close it instead of navigating away
      if (selectedConversation) {
        setSelectedConversation(null);
        dispatch(setCurrentChatId(null));
        // prevent further navigation by not calling navigate(-1)
        return;
      }
      // otherwise allow normal back
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedConversation, dispatch]);

  // Push history entry when user opens a chat via UI (so back closes chat)
  useEffect(() => {
    if (selectedConversation) {
      // Only push a simple state — we don't want to change URL; just add history entry
      try {
        window.history.pushState({ chat: selectedConversation._id }, "");
      } catch (e) {
        // pushState may fail in some embedded contexts; ignore.
      }
    }
  }, [selectedConversation]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageCircle size={50} className="mx-auto text-muted-foreground mb-4" />
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
